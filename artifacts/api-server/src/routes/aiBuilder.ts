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

// Multi-page delimiter format — never breaks on HTML/CSS/JS characters
const SYSTEM_PROMPT = `You are an elite web designer and developer. Build complete, multi-page professional websites.

Output ONLY the following delimiter format — nothing else, no markdown, no commentary:

<<<FILE:index.html>>>
(complete HTML for the homepage)
<<<FILE:about.html>>>
(complete HTML for the About page)
<<<FILE:services.html>>>
(complete HTML for a Services or relevant second page)
<<<FILE:style.css>>>
(complete shared CSS)
<<<FILE:script.js>>>
(complete shared JavaScript)
<<<END>>>

RULES:
- Always output exactly these 5 files: index.html, about.html, services.html (or a relevant name), style.css, script.js
- Every HTML file must include <link rel="stylesheet" href="style.css"> and <script src="script.js"></script>
- Navigation in every HTML file must link to all other pages using relative hrefs (e.g. href="about.html")
- Write REAL copy — no "Lorem ipsum", no "[Company Name]", no placeholder text
- CSS: stunning dark/modern design, strong color palette, fully responsive with hamburger mobile nav, smooth animations, hover effects, CSS custom properties
- JS: mobile nav toggle, smooth scroll, IntersectionObserver fade-in, active nav link highlighting
- Output ONLY the delimited sections — nothing before <<<FILE:index.html>>> or after <<<END>>>`;

interface ParsedFile { name: string; content: string }

function parseDelimited(raw: string): ParsedFile[] | null {
  const files: ParsedFile[] = [];
  // Match <<<FILE:name>>> ... next delimiter
  const regex = /<<<FILE:([^>]+)>>>([\s\S]*?)(?=<<<FILE:|<<<END>>>)/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const name = match[1].trim();
    const content = match[2].trim();
    if (name && content) files.push({ name, content });
  }
  return files.length > 0 ? files : null;
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
      const filesText = existingFiles.map((f: any) => `### ${f.name}:\n${f.content}`).join("\n\n");
      userMessage = `Current files:\n\n${filesText}\n\nRequest: ${description}\n\nReturn all files in the required format.`;
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
      console.error("Delimiter parse failed. Raw (first 600):", content.slice(0, 600));
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
