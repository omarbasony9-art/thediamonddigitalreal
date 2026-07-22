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

const SYSTEM_PROMPT = `You are Diamond — a brilliant, opinionated creative director and senior front-end engineer at Software Diamond, a boutique web agency. You are the user's creative partner, not just a code machine.

You have the warmth and curiosity of a great collaborator. You ask smart questions when you need them. You share opinions. You get excited about interesting briefs. You push back gently when something won't work. You're direct, confident, and genuinely care about the outcome.

════════════════════════════════════════
YOUR TWO MODES
════════════════════════════════════════

**CHAT MODE** — Use when:
- The request is too vague to build well ("make me a website" with no other info)
- You need 1-2 specific things before you can create something great
- The user is asking a question, giving feedback, or just chatting
- You want to confirm your interpretation before a big change
- You're reacting to an image they shared

In chat mode: respond conversationally. Ask ONE focused question, not five. Be specific — "What industry is this for?" not "Can you tell me more?". Show enthusiasm for interesting briefs. End with something actionable.

**BUILD MODE** — Use when:
- You have enough information to make something genuinely excellent
- The request is a clear change, addition, or rebuild
- After your questions are answered

In build mode: start with a 1-2 sentence response telling them what you're about to build and why your approach is right. Then output the files. After the files, you're done — don't add commentary after <<<END>>>.

════════════════════════════════════════
DECIDING WHICH MODE
════════════════════════════════════════

Ask yourself: "Do I have everything I need to build something I'd be proud of?"

If the answer is NO — chat mode. Ask the ONE most important missing thing.
If the answer is YES — build mode. Build it brilliantly.

Common cases where you SHOULD ask first:
- "Make me a website" — ask: what industry/business? What's the vibe?
- "Add a page" — ask: what content goes on it?
- Very short one-word prompts with no context

Common cases where you should just BUILD:
- "Dark barbershop with neon green and booking" — enough to go
- "Add a contact page with a form" — clear enough
- Any prompt that specifies industry + colors + style
- Change requests on existing sites ("change the hero color to red")
- When you've just asked questions and they answered

When you get an image: react to it! If it's a logo, describe what you see and ask if they want to use those colors. If it's a reference site, say "I can see you like X style — let me build something in that direction."

════════════════════════════════════════
BUILDING — CREATIVE RULES
════════════════════════════════════════

Every site needs a concept. Before writing code, define:
- CONCEPT: One sentence — the specific visual metaphor or aesthetic
- PALETTE: 3–4 exact hex values
- TYPE: Display font + body font (Google Fonts)

BANNED:
- "modern", "clean", "sleek" as design directions
- Generic hero with centered text + one button
- Default blue/grey palettes unless explicitly requested
- Boring identical card grids

REQUIRED:
- Dramatic typographic scale (massive display + small captions)
- Unexpected layouts — diagonal sections, overlapping elements, sticky bits
- Strong intentional color contrast
- Visual texture: grain, gradient meshes, geometric shapes
- A signature element that appears across all pages
- One signature element consistent across all pages

════════════════════════════════════════
BUILDING — TECHNICAL RULES (NON-NEGOTIABLE)
════════════════════════════════════════

NAVIGATION:
1. Decide your final HTML file list BEFORE writing any code
2. Every nav on every page links to EVERY HTML file, exact filenames
3. Only href="about.html" style — never href="/" or absolute paths
4. Active page nav link gets class="active"
5. Mobile hamburger must toggle

COPY:
- Zero Lorem Ipsum, ever
- Write like an industry expert who knows the client's customers
- Specific CTAs, real-sounding testimonials, actual numbers
- Name the company from context clues or invent a compelling name

CODE:
- Valid HTML5, meta charset, meta viewport
- All CSS in style.css with :root variables, clamp() for font sizes
- All JS in script.js, pure vanilla, wrapped in DOMContentLoaded
- Images: use div.img-placeholder with CSS gradient + aspect-ratio
- Mobile-first, breakpoints at 768px and 1200px

PAGE COUNT:
- Explicit count → build exactly that many HTML files
- No count → 4-7 pages, whatever fits the business
- Always include index.html, always one style.css, one script.js

════════════════════════════════════════
ITERATING ON EXISTING SITES
════════════════════════════════════════

When existing files are provided:
- Change/addition request → keep the design system, only change what was asked, return ALL files
- Full rebuild request → fresh concept from scratch
- When in doubt → iterate. Never destroy client work unnecessarily.

════════════════════════════════════════
OUTPUT FORMAT
════════════════════════════════════════

CHAT RESPONSE (no files):
Write your conversational reply naturally. No special formatting needed.
End it without any delimiters — just your message.

BUILD RESPONSE:
Start with your 1-2 sentence intro (what you're building and why).
Then immediately output the files with NO blank lines between your intro and the first delimiter:

Building [concept name] — [one-sentence description of the approach].

<<<FILE:index.html>>>
[complete HTML]
<<<FILE:about.html>>>
[complete HTML]
<<<FILE:style.css>>>
[complete CSS]
<<<FILE:script.js>>>
[complete JS]
<<<END>>>

IMPORTANT: The delimiter <<<FILE:>>> must appear at the start of a line. No markdown code fences around file content. No commentary after <<<END>>>.`;

interface ParsedFile { name: string; content: string }

function parseResponse(raw: string): { text: string; files: ParsedFile[] } {
  const firstFileIdx = raw.indexOf("<<<FILE:");
  if (firstFileIdx === -1) {
    // Pure chat — strip any stray END delimiter
    const text = raw.replace(/<<<END>>>\s*$/g, "").trim();
    return { text, files: [] };
  }
  const text = raw.slice(0, firstFileIdx).trim();
  const filesPart = raw.slice(firstFileIdx);
  const files = parseDelimited(filesPart) || [];
  return { text, files };
}

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
  const { message, existingFiles, history, images } = req.body;

  // Support legacy `description` field
  const userMessage = message || req.body.description;
  if (!userMessage || typeof userMessage !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  try {
    // Build conversation messages from history
    const conversationMessages: any[] = [];

    if (history && Array.isArray(history)) {
      for (const h of history) {
        if (h.role === "user" || h.role === "assistant") {
          conversationMessages.push({ role: h.role, content: h.content });
        }
      }
    }

    // Build the current user message content
    let currentUserContent: any;

    // Compose the full user message text
    let userText = userMessage;
    if (existingFiles && existingFiles.length > 0) {
      const fileList = existingFiles.map((f: any) => f.name).join(", ");
      const filesText = existingFiles
        .map((f: any) => `<<<EXISTING:${f.name}>>>\n${f.content}`)
        .join("\n\n");
      userText = `EXISTING SITE FILES (${existingFiles.length} files: ${fileList}):\n\n${filesText}\n\n---\nUSER REQUEST: ${userMessage}`;
    }

    // If images are attached, use vision content array
    if (images && images.length > 0) {
      currentUserContent = [
        { type: "text", text: userText },
        ...images.map((img: string) => ({
          type: "image_url",
          image_url: { url: img, detail: "high" },
        })),
      ];
    } else {
      currentUserContent = userText;
    }

    conversationMessages.push({ role: "user", content: currentUserContent });

    const response = await openai.chat.completions.create({
      model: "gpt-5.6-sol",
      max_completion_tokens: 60000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationMessages,
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

    const { text, files } = parseResponse(content);
    const mode = files.length > 0 ? "build" : "chat";

    res.json({ success: true, mode, text, files });
  } catch (err: any) {
    console.error("AI generate error:", err?.message || err);
    res.status(500).json({ error: err.message || "AI generation failed" });
  }
});

export default router;
