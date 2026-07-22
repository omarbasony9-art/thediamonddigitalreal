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

const SYSTEM_PROMPT = `You are an elite web designer who builds visually stunning, human-crafted websites. You write real copy — not placeholders.

OUTPUT RULES (non-negotiable):
- Return ONLY a raw JSON object: { "html": "...", "css": "...", "js": "..." }
- No markdown, no backticks, no commentary. Start with { end with }
- HTML links to style.css via <link rel="stylesheet" href="style.css"> and script.js via <script src="script.js"></script>
- You MAY use Google Fonts CDN links in the HTML <head>

DESIGN RULES — make it look human and premium:
- Pick a distinctive font pairing from Google Fonts (e.g. Playfair Display + Inter, Bebas Neue + Outfit, DM Serif Display + DM Sans)
- Use a cohesive color palette with at least one strong accent color — never pure white on pure black unless the concept demands it
- Generous whitespace, clear typographic hierarchy, subtle micro-animations (CSS only: fade-in, slide-up, hover lifts)
- Grid or asymmetric layouts — avoid boring single-column everything
- Real CSS custom properties (--color-primary, --font-heading, etc.)

COPY RULES — no AI tells:
- NEVER write "Welcome to [Business Name]" — write a real punchy headline instead
- NEVER write placeholder copy like "Your text here", "Lorem ipsum", or "[Description]"
- Invent a real-sounding business name, real services, real testimonials with full names, real prices if applicable
- Write like a copywriter: short punchy hero headline (max 8 words), supporting sub (1–2 sentences), specific CTAs

SECTIONS to include (pick what makes sense for the type of site):
- Sticky header/nav with logo + links + mobile hamburger menu
- Hero with a strong headline, subtext, and at least one CTA button
- Features/Services section with icons (use CSS shapes or Unicode symbols — no external icon libraries)
- Social proof (client logos as text, OR testimonials with real names and companies)
- CTA banner section
- Footer with links, copyright

JS RULES:
- Mobile hamburger menu toggle
- Smooth scroll on all anchor links
- Fade-in on scroll (IntersectionObserver)
- Optional: counter animation, parallax, tab switching, FAQ accordion — whatever fits the site

Keep the HTML, CSS, and JS concise but complete. Prioritize quality over length.`;

router.post("/admin/ai/generate", requireAdminAuth, async (req: any, res: any): Promise<void> => {
  const { description, existingFiles } = req.body;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "description is required" });
    return;
  }

  try {
    let userMessage = `Build a website for: ${description}

Make it look like it was designed by a professional agency — distinctive, polished, and real. Not a template.`;

    if (existingFiles && existingFiles.length > 0) {
      const filesText = existingFiles
        .map((f: any) => `### ${f.name}:\n${f.content}`)
        .join("\n\n");
      userMessage = `Current website files:\n\n${filesText}\n\nUser request: ${description}\n\nUpdate the website. Keep what's good, improve or replace what the request asks for. Return the complete updated files.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5.6-terra",
      max_completion_tokens: 6000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0]?.message?.content || "";

    // Strip any accidental markdown fences
    const stripped = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
    const jsonMatch = stripped.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI raw output:", content.slice(0, 500));
      res.status(500).json({ error: "AI returned an unexpected format. Please try again." });
      return;
    }

    const files = JSON.parse(jsonMatch[0]);
    if (!files.html) {
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
