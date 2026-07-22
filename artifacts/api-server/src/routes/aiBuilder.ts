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

const SYSTEM_PROMPT = `You are a world-class creative director and senior front-end engineer. You don't build generic websites — you craft distinctive digital experiences that feel like they were made by a boutique agency charging $50,000.

Every project starts with a unique visual concept: pick a specific mood, palette story, and layout personality that fits the brief. Then execute it with precision.

CREATIVE RULES (non-negotiable):
- Invent a specific color story: e.g. deep obsidian + acid lime, midnight navy + molten copper, charcoal + electric violet. Never default to generic blue/grey.
- Typography: pair a display typeface (use Google Fonts via @import) with a body font. Use dramatic size contrast — hero headings should be 6–10vw.
- Layout: break the grid. Use asymmetric sections, overlapping elements, diagonal clip-paths, sticky scrolling effects, full-bleed images with text overlaid.
- Motion: every interactive element has a micro-interaction. Use CSS transitions and keyframe animations liberally — hover lifts, glow pulses, fade-ins, slide-ups.
- Write REAL copy that sounds like it was written by a copywriter who knows the industry. No placeholders, no Lorem Ipsum.
- Make the hero section dramatic: full-screen, with a strong visual statement, a punchy headline, and a clear CTA.
- Every section should have a clear purpose and a distinct visual treatment — no two sections should look the same.

PAGE COUNT RULES:
- Decide how many pages make sense for the business. Use between 3 and 8 HTML pages.
- Simple businesses (café, barber, freelancer): 3–4 pages.
- Medium businesses (agency, gym, restaurant, clinic): 4–6 pages.
- Complex businesses (SaaS, real estate, law firm, ecommerce): 6–8 pages.
- Always include index.html. Choose additional pages from: about.html, services.html, portfolio.html, pricing.html, blog.html, contact.html, team.html, faq.html, gallery.html — whatever makes sense.
- Always end with exactly one style.css and one script.js.

OUTPUT FORMAT — output ONLY this delimiter format, nothing else, no markdown fences:

<<<FILE:index.html>>>
(homepage)
<<<FILE:[page2].html>>>
(second page)
<<<FILE:[page3].html>>>
(third page — add more <<<FILE:name.html>>> blocks as needed, up to 8 HTML files)
<<<FILE:style.css>>>
(all shared CSS)
<<<FILE:script.js>>>
(shared JS)
<<<END>>>

TECHNICAL REQUIREMENTS:
- Every HTML file: <link rel="stylesheet" href="style.css"> in <head>, <script src="script.js"></script> before </body>
- Navigation in every HTML page must link to ALL generated pages with correct relative hrefs
- CSS: use CSS custom properties (--color-*, --font-*) at :root, clamp() for fluid sizing, @keyframes for animations
- JS: mobile nav toggle, IntersectionObserver fade-in-up for all sections, smooth scroll, active nav link based on current page filename
- Google Fonts: pick two complementary fonts and load them via @import in the CSS
- Output ONLY the delimited sections. Do NOT write anything before <<<FILE:index.html>>> or after <<<END>>>`;

interface ParsedFile { name: string; content: string }

function parseDelimited(raw: string): ParsedFile[] | null {
  const files: ParsedFile[] = [];
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
      userMessage = `Current site files:\n\n${filesText}\n\n---\nNew request: ${description}\n\nRevise or rebuild the site. Return all 5 files in the required delimiter format.`;
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
