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

// Delimiter-based format — avoids JSON escaping issues with HTML/CSS/JS content
const SYSTEM_PROMPT = `You are an elite web designer. Output ONLY the following format, nothing else:

<<<HTML>>>
(complete HTML file here)
<<<CSS>>>
(complete CSS file here)
<<<JS>>>
(complete JavaScript here)
<<<END>>>

Rules:
- HTML must include <link rel="stylesheet" href="style.css"> and <script src="script.js"></script>
- You may use Google Fonts CDN in the HTML <head>
- Write REAL copy — no Lorem ipsum, no placeholders, no "[Company Name]"
- Build a complete, polished, professional website
- CSS: beautiful modern design, strong color palette, fully responsive, smooth animations
- JS: mobile nav toggle, smooth scroll, IntersectionObserver fade-in
- Output ONLY the delimited sections above — no commentary, no markdown fences`;

function parseDelimited(raw: string): { html: string; css: string; js: string } | null {
  const html = raw.match(/<<<HTML>>>([\s\S]*?)<<<CSS>>>/)?.[1]?.trim();
  const css  = raw.match(/<<<CSS>>>([\s\S]*?)<<<JS>>>/)?.[1]?.trim();
  const js   = raw.match(/<<<JS>>>([\s\S]*?)<<<END>>>/)?.[1]?.trim();
  if (!html) return null;
  return { html, css: css || "", js: js || "" };
}

router.post("/admin/ai/generate", requireAdminAuth, async (req: any, res: any): Promise<void> => {
  const { description, existingFiles } = req.body;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "description is required" });
    return;
  }

  try {
    let userMessage = `Build a website: ${description}`;

    if (existingFiles && existingFiles.length > 0) {
      const filesText = existingFiles
        .map((f: any) => `### ${f.name}:\n${f.content}`)
        .join("\n\n");
      userMessage = `Current files:\n\n${filesText}\n\nRequest: ${description}\n\nReturn the complete updated HTML, CSS, and JS in the required format.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5.6-terra",
      max_completion_tokens: 32000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const finishReason = response.choices[0]?.finish_reason;

    console.log(`AI finish_reason: ${finishReason}, content length: ${content.length}`);

    if (!content) {
      console.error("AI returned empty content. Full response:", JSON.stringify(response));
      res.status(500).json({ error: "AI returned an empty response. Please try again." });
      return;
    }

    const files = parseDelimited(content);

    if (!files) {
      // Fallback: try to find any HTML in the response
      console.error("Delimiter parse failed. Raw output (first 600 chars):", content.slice(0, 600));
      res.status(500).json({ error: "AI returned an unexpected format. Please try again." });
      return;
    }

    res.json({ success: true, files });
  } catch (err: any) {
    console.error("AI generate error:", err?.message || err);
    res.status(500).json({ error: err.message || "AI generation failed" });
  }
});

export default router;
