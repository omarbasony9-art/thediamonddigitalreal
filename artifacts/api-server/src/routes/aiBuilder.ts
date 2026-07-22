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

const SYSTEM_PROMPT = `You are an expert web developer. The user describes a website they want and you generate it.

Return ONLY a JSON object with exactly these three fields:
{
  "html": "full HTML content for index.html",
  "css": "full CSS content for style.css",
  "js": "full JavaScript content for script.js"
}

Rules:
- The HTML file should link to style.css with <link rel="stylesheet" href="style.css"> and script.js with <script src="script.js"></script>
- Build a complete, polished, professional website — not a placeholder
- Use modern design: clean layout, good typography, proper spacing
- Make it fully responsive (mobile-friendly)
- Use CSS custom properties for colors/fonts
- Add smooth animations and hover effects where appropriate
- The JS file can be empty if not needed, but add interactivity where it makes sense (mobile nav toggle, smooth scroll, form validation, etc.)
- Do NOT use external CDN links or frameworks — pure HTML/CSS/JS only
- Do NOT include any markdown, explanation, or extra text — ONLY the JSON object

If the user asks to improve or update an existing site, incorporate their current files and improve them based on their request.`;

router.post("/admin/ai/generate", requireAdminAuth, async (req: any, res: any): Promise<void> => {
  const { description, existingFiles } = req.body;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "description is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    let userMessage = `Build me a website: ${description}`;
    if (existingFiles && existingFiles.length > 0) {
      const filesText = existingFiles.map((f: any) => `\n\n### ${f.name}:\n${f.content}`).join("");
      userMessage = `Here are the current website files:${filesText}\n\nUser request: ${description}\n\nUpdate/improve the website based on the request above.`;
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-5.6-terra",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`);
      }
    }

    // Parse and send the final files
    const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      res.write(`data: ${JSON.stringify({ type: "done", files: parsed })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Could not parse AI response" })}\n\n`);
    }
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ type: "error", message: err.message || "AI generation failed" })}\n\n`);
  }

  res.end();
});

export default router;
