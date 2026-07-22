import jwt from "jsonwebtoken";
import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret";

const requireAdminAuth = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try { jwt.verify(auth.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid or expired token" }); }
};

const SYSTEM_PROMPT = `You are an expert web developer building complete, professional websites.

The user describes a website and you generate it as a JSON object with exactly these fields:
{
  "html": "...",
  "css": "...",
  "js": "..."
}

CRITICAL RULES:
- Return ONLY raw JSON. No markdown code blocks, no backticks, no explanation, no text before or after. Start your response with { and end with }.
- The HTML links to style.css with <link rel="stylesheet" href="style.css"> and script.js with <script src="script.js"></script>
- Build a COMPLETE, POLISHED, PROFESSIONAL website — not a placeholder or template. Real content, real sections, real copy.
- Modern design: great typography, proper spacing, beautiful layout
- Fully responsive — works on mobile and desktop
- Smooth CSS animations and hover effects
- The JS adds real interactivity (mobile nav toggle, smooth scroll, form validation, counters, etc.)
- Pure HTML/CSS/JS only — no CDN links, no external frameworks
- Make it look like it was built by a professional agency`;

router.post("/admin/ai/generate", requireAdminAuth, async (req: any, res: any): Promise<void> => {
  const { description, existingFiles } = req.body;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "description is required" });
    return;
  }

  try {
    let userMessage = `Build me a website: ${description}`;

    if (existingFiles && existingFiles.length > 0) {
      const filesText = existingFiles
        .map((f: any) => `### ${f.name}:\n\`\`\`\n${f.content}\n\`\`\``)
        .join("\n\n");
      userMessage = `Here are the current website files:\n\n${filesText}\n\nUser request: ${description}\n\nUpdate/improve the website based on the request. Return the complete updated files.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5.6-terra",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0]?.message?.content || "";

    // Robust JSON extraction — strips any accidental markdown fences
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "AI returned an unexpected format. Please try again." });
      return;
    }

    const files = JSON.parse(jsonMatch[0]);
    if (!files.html || !files.css || !files.js) {
      res.status(500).json({ error: "AI response was incomplete. Please try again." });
      return;
    }

    res.json({ success: true, files });
  } catch (err: any) {
    console.error("AI generate error:", err);
    res.status(500).json({ error: err.message || "AI generation failed" });
  }
});

export default router;
