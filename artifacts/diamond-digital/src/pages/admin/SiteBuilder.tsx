import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import Editor from "@monaco-editor/react";
import {
  useGetSite, useUpdateSite, useListSitePages,
  useCreateSitePage, useUpdateSitePage, useDeleteSitePage,
  getGetSiteQueryKey, getListSitePagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, RefreshCw, Settings, Plus, Trash2, FileCode,
  Copy, ChevronRight, Sparkles, Send, Loader2,
  Globe, CheckCircle2, ExternalLink, Eye, EyeOff, RotateCcw,
  FileJson, FileCog, File, Rocket, Link2, Paperclip, X, Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type FileItem = { id: number; title: string; slug: string; content: string; order: number };

type AttachedImage = { dataUrl: string; name: string; id: string };

// History entry for multi-turn context sent to the API
type HistoryEntry = { role: "user" | "assistant"; content: string };

type AiMsg =
  | { role: "user"; text: string; images?: AttachedImage[] }
  | { role: "assistant"; text: string; mode: "chat" | "build"; files?: string[] }
  | { role: "thinking" }
  | { role: "queued"; text: string; position: number }
  | { role: "welcome" };

// ─── Utilities ────────────────────────────────────────────────────────────────

const getLang = (slug: string) => {
  if (slug.endsWith(".html")) return "html";
  if (slug.endsWith(".css")) return "css";
  if (slug.endsWith(".js")) return "javascript";
  if (slug.endsWith(".ts")) return "typescript";
  if (slug.endsWith(".json")) return "json";
  if (slug.endsWith(".md")) return "markdown";
  return "plaintext";
};

function FileIcon({ slug, className = "w-3.5 h-3.5" }: { slug: string; className?: string }) {
  if (slug.endsWith(".html")) return <FileCode className={className} />;
  if (slug.endsWith(".css")) return <FileCog className={`${className} text-blue-400`} />;
  if (slug.endsWith(".js")) return <FileJson className={`${className} text-yellow-400`} />;
  return <File className={className} />;
}

/** Render minimal markdown — bold, italic, inline code, bullets, headings */
function MarkdownText({ text }: { text: string }) {
  const renderInline = (str: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    // Match **bold**, *italic*, `code`
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = regex.exec(str)) !== null) {
      if (m.index > last) parts.push(str.slice(last, m.index));
      if (m[2]) parts.push(<strong key={idx++} className="text-white font-semibold">{m[2]}</strong>);
      else if (m[3]) parts.push(<em key={idx++} className="italic text-white/80">{m[3]}</em>);
      else if (m[4]) parts.push(<code key={idx++} className="px-1 py-0.5 rounded bg-white/10 text-[#7dd3fc] font-mono text-[11px]">{m[4]}</code>);
      last = m.index + m[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts;
  };

  const lines = text.split("\n");
  const output: React.ReactNode[] = [];
  let bulletBuf: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bulletBuf.length === 0) return;
    output.push(
      <ul key={key++} className="space-y-1 pl-4 list-none my-1">
        {bulletBuf.map((b, i) => (
          <li key={i} className="flex gap-2 text-white/75 text-sm leading-relaxed">
            <span className="text-[#0066ff] mt-1 shrink-0">•</span>
            <span>{renderInline(b)}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuf = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
      bulletBuf.push(trimmed.slice(2));
      continue;
    }
    flushBullets();
    if (trimmed === "") {
      output.push(<div key={key++} className="h-2" />);
    } else if (trimmed.startsWith("### ")) {
      output.push(<p key={key++} className="text-sm font-semibold text-white mt-2 mb-0.5">{renderInline(trimmed.slice(4))}</p>);
    } else if (trimmed.startsWith("## ")) {
      output.push(<p key={key++} className="text-sm font-bold text-white mt-3 mb-1">{renderInline(trimmed.slice(3))}</p>);
    } else if (trimmed.startsWith("# ")) {
      output.push(<p key={key++} className="text-base font-bold text-white mt-3 mb-1">{renderInline(trimmed.slice(2))}</p>);
    } else {
      output.push(<p key={key++} className="text-sm text-white/80 leading-relaxed">{renderInline(trimmed)}</p>);
    }
  }
  flushBullets();
  return <div className="space-y-0.5">{output}</div>;
}

/**
 * Build preview doc — inlines CSS/JS into HTML, injects nav interceptor.
 */
const buildPreview = (files: FileItem[], editMap: Map<number, string>, pageSlug?: string) => {
  const resolve = (f: FileItem) => editMap.has(f.id) ? editMap.get(f.id)! : f.content;
  const html = (pageSlug ? files.find((f) => f.slug === pageSlug) : null)
    || files.find((f) => f.slug === "index.html")
    || files.find((f) => f.slug.endsWith(".html"));
  if (!html) return `<html><body style="font:14px system-ui;color:#666;padding:48px;text-align:center;background:#111"><p>No HTML file yet. Ask AI to build your site.</p></body></html>`;
  let doc = resolve(html);
  const styles = files.filter((f) => f.slug.endsWith(".css")).map((f) => `<style>${resolve(f)}</style>`).join("\n");
  const scripts = files.filter((f) => f.slug.endsWith(".js")).map((f) => `<script>${resolve(f)}<\/script>`).join("\n");
  const navInterceptor = `<script>
document.addEventListener('click',function(e){
  var a=e.target.closest('a');if(!a)return;
  var href=a.getAttribute('href');
  if(href&&!href.startsWith('http')&&!href.startsWith('#')&&!href.startsWith('mailto:')&&!href.startsWith('tel:')){
    e.preventDefault();
    window.parent.postMessage({type:'preview-navigate',page:href},'*');
  }
});
<\/script>`;
  doc = doc.includes("</head>") ? doc.replace("</head>", `${styles}\n</head>`) : styles + doc;
  doc = doc.includes("</body>") ? doc.replace("</body>", `${navInterceptor}\n${scripts}\n</body>`) : doc + navInterceptor + scripts;
  return doc;
};

const STARTERS: Omit<FileItem, "id">[] = [
  { title: "index.html", slug: "index.html", order: 0, content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <div class="logo">My Brand</div>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
    </nav>
  </header>
  <section class="hero">
    <h1>Build Something Amazing</h1>
    <p>Describe your website to the AI and watch it come to life.</p>
    <button class="btn">Get Started</button>
  </section>
  <footer><p>&copy; 2026 My Website</p></footer>
  <script src="script.js"></script>
</body>
</html>` },
  { title: "style.css", slug: "style.css", order: 1, content: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f1a; color: #e8e8f0; line-height: 1.6; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; background: rgba(255,255,255,.03); border-bottom: 1px solid rgba(255,255,255,.08); position: sticky; top: 0; backdrop-filter: blur(12px); }
.logo { font-weight: 800; font-size: 1.1rem; color: #00cfff; letter-spacing: 1px; }
nav a { color: #aaa; text-decoration: none; margin-left: 1.5rem; transition: color .2s; }
nav a:hover { color: #fff; }
.hero { text-align: center; padding: 6rem 2rem; }
.hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 0%, #00cfff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero p { color: #888; font-size: 1.1rem; margin-bottom: 2rem; }
.btn { background: #00cfff; color: #0f0f1a; border: none; padding: .85rem 2rem; font-size: .95rem; font-weight: 700; cursor: pointer; border-radius: 4px; }
footer { text-align: center; padding: 2rem; color: #555; border-top: 1px solid rgba(255,255,255,.06); }` },
  { title: "script.js", slug: "script.js", order: 2, content: `console.log('Site loaded!');` },
];

const SUGGESTIONS = [
  "Dark barbershop with neon green & booking",
  "Luxury real estate with full-screen hero",
  "Minimalist SaaS with pricing table",
  "Gym site with class schedule & trainers",
  "Restaurant with menu & reservation form",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SiteBuilder() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const [previewDoc, setPreviewDoc] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [previewPage, setPreviewPage] = useState("index.html");
  const [addingFile, setAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [deployTab, setDeployTab] = useState<"quick" | "domain">("quick");
  const [deployStep, setDeployStep] = useState<"form" | "live">("form");
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [platformDomain, setPlatformDomain] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const editMapRef = useRef<Map<number, string>>(new Map());
  const [editMapVersion, setEditMapVersion] = useState(0);
  const bumpEditMap = () => setEditMapVersion((v) => v + 1);

  // AI state
  const [aiMessages, setAiMessages] = useState<AiMsg[]>([{ role: "welcome" }]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const conversationHistoryRef = useRef<HistoryEntry[]>([]);
  const messageQueueRef = useRef<{ text: string; images: AttachedImage[] }[]>([]);
  const aiLoadingRef = useRef(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<typeof pages>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  const { data: site } = useGetSite(id, { query: { queryKey: getGetSiteQueryKey(id) } });
  const { data: pages, isLoading: pagesLoading } = useListSitePages(id, { query: { queryKey: getListSitePagesQueryKey(id) } });

  const updateSite = useUpdateSite();
  const createPage = useCreateSitePage();
  const updatePage = useUpdateSitePage();
  const deletePage = useDeleteSitePage();

  useEffect(() => { pagesRef.current = pages; }, [pages]);

  // Seed starters
  useEffect(() => {
    if (seeding || pagesLoading || (pages && pages.length > 0) || !pages) return;
    setSeeding(true);
    (async () => {
      for (const s of STARTERS) {
        await new Promise<void>((r) => createPage.mutate({ id, data: { title: s.title, slug: s.slug, content: s.content } }, { onSuccess: () => r(), onError: () => r() }));
      }
      queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
    })();
  }, [pages, pagesLoading]);

  useEffect(() => {
    if (pages && pages.length > 0 && activeFileId === null) {
      const html = pages.find((p) => p.slug === "index.html") || pages.find((p) => p.slug.endsWith(".html")) || pages[0];
      setActiveFileId(html.id);
    }
  }, [pages, activeFileId]);

  useEffect(() => {
    if (!pages) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewDoc(buildPreview(pages as FileItem[], editMapRef.current, previewPage));
    }, 400);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMapVersion, pages, previewPage]);

  useEffect(() => {
    if (pages && pages.length > 0) {
      setPreviewDoc(buildPreview(pages as FileItem[], editMapRef.current, previewPage));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "preview-navigate") return;
      const target: string = e.data.page || "index.html";
      const slug = target.split("/").pop() || target;
      const file = pagesRef.current?.find((p) => p.slug === slug);
      if (file) {
        setPreviewPage(slug);
        setPreviewDoc(buildPreview(pagesRef.current as FileItem[], editMapRef.current, slug));
        setPreviewKey((k) => k + 1);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);

  useEffect(() => {
    if (site?.liveUrl) setPublishedUrl(site.liveUrl);
    else if (site?.domain && site.domain.startsWith("http")) setPublishedUrl(site.domain);
  }, [site]);

  const activeFile = pages?.find((p) => p.id === activeFileId) || pages?.[0];
  const activeContent = activeFileId !== null && editMapRef.current.has(activeFileId)
    ? editMapRef.current.get(activeFileId)!
    : (activeFile?.content ?? "");
  const hasUnsaved = activeFile && editMapRef.current.has(activeFile.id) && editMapRef.current.get(activeFile.id) !== activeFile.content;
  const anyUnsaved = pages?.some((p) => editMapRef.current.has(p.id) && editMapRef.current.get(p.id) !== p.content);

  const handleEditorChange = useCallback((val: string | undefined) => {
    if (activeFileId === null) return;
    editMapRef.current.set(activeFileId, val ?? "");
    bumpEditMap();
  }, [activeFileId]);

  const switchFile = useCallback((file: FileItem) => {
    setActiveFileId(file.id);
    if (!editMapRef.current.has(file.id)) {
      editMapRef.current.set(file.id, file.content);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!pages) return;
    const dirty = pages.filter(
      (p) => editMapRef.current.has(p.id) && editMapRef.current.get(p.id) !== p.content
    );
    if (dirty.length === 0) return;
    await Promise.all(
      dirty.map(
        (p) =>
          new Promise<void>((res) =>
            updatePage.mutate(
              { id, pageId: p.id, data: { content: editMapRef.current.get(p.id)!, title: p.title } },
              { onSuccess: () => res(), onError: () => res() }
            )
          )
      )
    );
    await queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
    const fresh = pagesRef.current;
    if (fresh) setPreviewDoc(buildPreview(fresh as FileItem[], editMapRef.current, previewPage));
    setPreviewKey((k) => k + 1);
    toast({ title: `Saved ${dirty.length} file${dirty.length > 1 ? "s" : ""} ✓` });
  }, [pages, id, updatePage, queryClient, toast]);

  // ── Image attachment ────────────────────────────────────────────────────────

  const readImageFile = (file: File): Promise<AttachedImage> =>
    new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) { reject(new Error("Not an image")); return; }
      const reader = new FileReader();
      reader.onload = () =>
        resolve({ dataUrl: reader.result as string, name: file.name, id: crypto.randomUUID() });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const attachFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const imgs = await Promise.allSettled(arr.map(readImageFile));
    const good = imgs.filter((r): r is PromiseFulfilledResult<AttachedImage> => r.status === "fulfilled").map((r) => r.value);
    if (good.length) setAttachedImages((prev) => [...prev, ...good]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) attachFiles(e.target.files);
    e.target.value = "";
  };

  // Drag-drop on the chat panel
  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!chatPanelRef.current?.contains(e.relatedTarget as Node)) setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) attachFiles(e.dataTransfer.files);
  };

  // ── Core AI execution ───────────────────────────────────────────────────────

  const runAiPrompt = async (prompt: string, imgs: AttachedImage[]) => {
    const currentPages = pagesRef.current || [];
    const existingFiles = currentPages.map((p) => ({
      name: p.slug,
      content: editMapRef.current.has(p.id) ? editMapRef.current.get(p.id)! : p.content,
    }));

    // Add user message to UI
    const userMsg: AiMsg = { role: "user", text: prompt, images: imgs.length > 0 ? imgs : undefined };
    setAiMessages((prev) => [...prev, userMsg, { role: "thinking" }]);
    aiLoadingRef.current = true;
    setAiLoading(true);

    // Build history from current conversation (last 12 exchanges)
    const history = conversationHistoryRef.current.slice(-12);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${import.meta.env.BASE_URL}api/admin/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: prompt,
          existingFiles,
          history,
          images: imgs.map((img) => img.dataUrl),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");

      const { mode, text, files } = data as { mode: "chat" | "build"; text: string; files: { name: string; content: string }[] };

      // Update conversation history
      conversationHistoryRef.current.push({ role: "user", content: prompt });
      conversationHistoryRef.current.push({ role: "assistant", content: text });

      if (mode === "build" && files.length > 0) {
        // Save generated files
        const createdNames: string[] = [];
        for (const file of files) {
          const existing = currentPages.find((p) => p.slug === file.name);
          await new Promise<void>((resolve) => {
            if (existing) {
              updatePage.mutate(
                { id, pageId: existing.id, data: { content: file.content, title: file.name } },
                { onSuccess: () => resolve(), onError: () => resolve() }
              );
            } else {
              createPage.mutate(
                { id, data: { title: file.name, slug: file.name, content: file.content } },
                { onSuccess: () => resolve(), onError: () => resolve() }
              );
            }
          });
          createdNames.push(file.name);
        }

        await queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });

        const freshPages = pagesRef.current || currentPages;
        const nameToContent = Object.fromEntries(files.map((f) => [f.name, f.content]));
        for (const p of freshPages) {
          if (nameToContent[p.slug] !== undefined) editMapRef.current.set(p.id, nameToContent[p.slug]);
        }
        bumpEditMap();

        const htmlPage = freshPages.find((p) => p.slug === "index.html") || freshPages.find((p) => p.slug.endsWith(".html"));
        if (htmlPage) setActiveFileId(htmlPage.id);
        setPreviewKey((k) => k + 1);

        setAiMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", mode: "build", text: text || `Built ${createdNames.length} files. Switch tabs to explore — the preview updates live.`, files: createdNames };
          return copy;
        });
      } else {
        // Pure chat response
        setAiMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", mode: "chat", text };
          return copy;
        });
      }
    } catch (err: any) {
      setAiMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", mode: "chat", text: `❌ ${err.message}. Please try again.` };
        return copy;
      });
    } finally {
      aiLoadingRef.current = false;
      setAiLoading(false);
      const next = messageQueueRef.current.shift();
      setQueueLength(messageQueueRef.current.length);
      if (next) {
        setAiMessages((prev) => prev.filter((m) => !(m.role === "queued" && (m as any).text === next.text)));
        setTimeout(() => runAiPrompt(next.text, next.images), 150);
      }
    }
  };

  const handleAiSend = (overridePrompt?: string) => {
    const prompt = (overridePrompt ?? aiInput).trim();
    if (!prompt && attachedImages.length === 0) return;
    const finalPrompt = prompt || "Here's an image for reference";
    const imgs = [...attachedImages];

    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setAiInput("");
    setAttachedImages([]);

    if (aiLoadingRef.current) {
      messageQueueRef.current.push({ text: finalPrompt, images: imgs });
      const pos = messageQueueRef.current.length;
      setQueueLength(pos);
      setAiMessages((prev) => [...prev, { role: "queued", text: finalPrompt, position: pos } as AiMsg]);
    } else {
      runAiPrompt(finalPrompt, imgs);
    }
  };

  const openDeployDialog = async () => {
    const existingDomain = site?.domain && !site.domain.startsWith("http") ? site.domain : "";
    setDomainInput(existingDomain);
    setDeployStep("form");
    setDeployTab(existingDomain ? "domain" : "quick");
    setDeployOpen(true);
    try {
      const token = localStorage.getItem("admin_token");
      const r = await fetch(`${import.meta.env.BASE_URL}api/admin/deployment-domain`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (d.domain) setPlatformDomain(d.domain);
    } catch { /* non-critical */ }
  };

  const handlePublish = async (useCustomDomain: boolean) => {
    setPublishing(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${import.meta.env.BASE_URL}api/sites/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ customDomain: useCustomDomain ? domainInput.trim() : "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deploy failed");
      setPublishedUrl(data.publishedUrl);
      setDeployStep("live");
      queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(id) });
    } catch (err: any) {
      toast({ title: "Deploy failed", description: err.message, variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    let slug = newFileName.trim();
    if (!slug.includes(".")) slug += ".html";
    const starterContent = `<!-- ${slug} -->\n`;
    createPage.mutate(
      { id, data: { title: slug, slug, content: starterContent } },
      {
        onSuccess: (f) => {
          queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
          editMapRef.current.set(f.id, starterContent);
          setActiveFileId(f.id);
          setNewFileName("");
          setAddingFile(false);
        },
      }
    );
  };

  const handleDeleteFile = (fileId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this file?")) return;
    deletePage.mutate({ id, pageId: fileId }, {
      onSuccess: () => {
        editMapRef.current.delete(fileId);
        if (activeFileId === fileId) setActiveFileId(null);
        queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
      },
    });
  };

  const isLive = site?.status === "live";

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="h-screen w-full flex flex-col bg-[#0e0e0e] text-white overflow-hidden" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div className="h-11 bg-[#161616] border-b border-white/8 flex items-center px-3 gap-2 shrink-0">
        <Link href="/admin/sites">
          <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-white/35 font-mono text-xs truncate hidden sm:block">{site?.clientName}</span>
          <ChevronRight className="w-3 h-3 text-white/20 shrink-0 hidden sm:block" />
          <span className="text-white font-semibold truncate">{site?.projectName || "Loading…"}</span>
        </div>
        {isLive && <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded shrink-0">LIVE</span>}
        <div className="flex-1" />
        <button
          onClick={() => setShowPreview((v) => !v)}
          className={`flex items-center gap-1.5 px-2.5 h-7 text-xs font-mono rounded transition-colors ${showPreview ? "bg-white/10 text-white" : "bg-white/5 text-white/40 hover:text-white/70"}`}
        >
          {showPreview ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button onClick={() => setSettingsOpen(true)} className="w-8 h-8 flex items-center justify-center text-white/35 hover:text-white hover:bg-white/8 rounded transition-colors">
          <Settings className="w-3.5 h-3.5" />
        </button>
        {anyUnsaved && (
          <button onClick={handleSave} disabled={updatePage.isPending}
            className="flex items-center gap-1.5 px-3 h-7 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono rounded font-bold transition-colors">
            {updatePage.isPending ? "Saving…" : "Save All"}
          </button>
        )}
        <button onClick={openDeployDialog}
          className={`flex items-center gap-1.5 px-3 h-7 text-xs font-mono font-bold rounded transition-colors ${isLive ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30" : "bg-[#0066ff] hover:bg-[#0052cc] text-white"}`}>
          <Rocket className="w-3 h-3" />{isLive ? "Live ↗" : "Deploy"}
        </button>
      </div>

      {/* ── WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* FILE EXPLORER */}
        <div className="w-44 shrink-0 bg-[#161616] border-r border-white/6 flex flex-col overflow-hidden">
          <div className="px-3 py-2.5 flex items-center justify-between border-b border-white/5">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Files</span>
            <button onClick={() => setAddingFile(true)} className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/8 rounded transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {pagesLoading ? (
              <div className="px-3 py-2 text-[10px] text-white/25 font-mono">Loading…</div>
            ) : pages?.map((file) => {
              const active = file.id === activeFileId;
              const dirty = editMapRef.current.has(file.id) && editMapRef.current.get(file.id) !== file.content;
              return (
                <div key={file.id} onClick={() => switchFile(file as FileItem)}
                  className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${active ? "bg-white/8 text-white" : "text-white/40 hover:bg-white/4 hover:text-white/70"}`}>
                  <div className="flex items-center gap-2 text-[11px] font-mono truncate min-w-0">
                    <FileIcon slug={file.slug} className="w-3 h-3 shrink-0 opacity-60" />
                    <span className="truncate">{file.slug}</span>
                    {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                  </div>
                  <button onClick={(e) => handleDeleteFile(file.id, e)} className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-red-400 transition-all shrink-0 ml-1">
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
            {addingFile && (
              <div className="px-3 py-2 border-t border-white/5">
                <Input autoFocus value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddFile(); if (e.key === "Escape") setAddingFile(false); }}
                  placeholder="name.html" className="h-6 text-[10px] font-mono bg-white/8 border-white/15 rounded px-2 text-white placeholder:text-white/25" />
                <div className="flex gap-2 mt-1">
                  <button onClick={handleAddFile} className="text-[10px] font-mono text-[#0066ff] hover:text-blue-400">Create</button>
                  <button onClick={() => { setAddingFile(false); setNewFileName(""); }} className="text-[10px] font-mono text-white/25 hover:text-white/50">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* EDITOR + PREVIEW */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="h-9 bg-[#1e1e1e] border-b border-white/6 flex items-end overflow-x-auto shrink-0">
            {pages?.map((file) => {
              const active = file.id === activeFileId;
              const dirty = editMapRef.current.has(file.id) && editMapRef.current.get(file.id) !== file.content;
              return (
                <button key={file.id} onClick={() => switchFile(file as FileItem)}
                  className={`flex items-center gap-1.5 px-4 h-full text-[11px] font-mono transition-colors shrink-0 border-r border-white/4 ${active ? "bg-[#0e0e0e] text-white border-t-2 border-t-[#0066ff]" : "text-white/35 hover:text-white/65 hover:bg-white/3"}`}>
                  <FileIcon slug={file.slug} className="w-3 h-3 opacity-70" />
                  {file.slug}
                  {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Monaco */}
            <div className={showPreview ? "w-1/2 flex flex-col overflow-hidden border-r border-white/6" : "flex-1 flex flex-col overflow-hidden"}>
              {activeFile ? (
                <Editor
                  key={activeFileId ?? "none"}
                  height="100%"
                  language={getLang(activeFile.slug)}
                  value={activeContent}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    tabSize: 2,
                    wordWrap: "off",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace",
                    fontLigatures: true,
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    padding: { top: 12, bottom: 12 },
                    lineNumbers: "on",
                    bracketPairColorization: { enabled: true },
                  }}
                  onMount={(editor) => {
                    editor.addAction({ id: "save", label: "Save", keybindings: [2097], run: handleSave });
                  }}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/15 flex-col gap-3">
                  <FileCode className="w-8 h-8" />
                  <p className="text-xs font-mono">Select a file to edit</p>
                </div>
              )}
            </div>

            {/* Live preview */}
            {showPreview && (
              <div className="w-1/2 flex flex-col overflow-hidden">
                <div className="h-8 bg-[#1a1a1a] flex items-center px-3 gap-2 shrink-0 border-b border-white/5">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/60" />
                  </div>
                  <div className="flex-1 mx-2 bg-[#0e0e0e] rounded text-[10px] font-mono text-white/30 px-2 py-0.5 truncate">
                    {publishedUrl ? `${publishedUrl}/${previewPage === "index.html" ? "" : previewPage}` : previewPage}
                  </div>
                  <button
                    onClick={() => {
                      if (pages) setPreviewDoc(buildPreview(pages as FileItem[], editMapRef.current, previewPage));
                      setPreviewKey((k) => k + 1);
                    }}
                    className="text-white/20 hover:text-white/50 transition-colors shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                {(pages?.filter((p) => p.slug.endsWith(".html")).length ?? 0) > 1 && (
                  <div className="flex items-center overflow-x-auto bg-[#111] border-b border-white/5 shrink-0 px-2 gap-1 py-1">
                    {pages?.filter((p) => p.slug.endsWith(".html")).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPreviewPage(p.slug);
                          setPreviewDoc(buildPreview(pages as FileItem[], editMapRef.current, p.slug));
                          setPreviewKey((k) => k + 1);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono shrink-0 transition-colors ${previewPage === p.slug ? "bg-[#0066ff] text-white" : "text-white/30 hover:text-white/60 hover:bg-white/6"}`}
                      >
                        <Globe className="w-2.5 h-2.5 opacity-60" />
                        {p.slug}
                      </button>
                    ))}
                  </div>
                )}
                <iframe
                  key={previewKey}
                  srcDoc={previewDoc}
                  sandbox="allow-scripts"
                  className="flex-1 w-full border-none bg-white"
                  title="preview"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── AI PANEL ── */}
        <div
          ref={chatPanelRef}
          className={`w-80 shrink-0 border-l flex flex-col overflow-hidden relative transition-colors ${isDragOver ? "border-[#0066ff]/60 bg-[#0a1628]" : "border-white/6 bg-[#141414]"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragOver && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
              <div className="border-2 border-dashed border-[#0066ff]/70 rounded-2xl m-4 flex-1 w-[calc(100%-2rem)] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0066ff]/20 border border-[#0066ff]/40 flex items-center justify-center">
                  <Image className="w-6 h-6 text-[#0066ff]" />
                </div>
                <p className="text-sm font-semibold text-[#0066ff]">Drop image here</p>
                <p className="text-xs text-white/40">AI will analyze and use it</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="h-11 flex items-center px-4 border-b border-white/6 shrink-0 gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0066ff] flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Diamond AI</span>
            {queueLength > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[9px] font-mono text-amber-400">
                {queueLength} queued
              </span>
            )}
            <div className="flex-1" />
            <button
              onClick={() => {
                setAiMessages([{ role: "welcome" }]);
                messageQueueRef.current = [];
                conversationHistoryRef.current = [];
                setQueueLength(0);
                setAttachedImages([]);
              }}
              className="w-7 h-7 flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/6 rounded transition-colors"
              title="New conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((msg, i) => (
              <AiMessage key={i} msg={msg} onSuggestion={(s) => handleAiSend(s)} />
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-white/6 shrink-0 space-y-2">
            {/* Attached image previews */}
            {attachedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1">
                {attachedImages.map((img) => (
                  <div key={img.id} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-white/15 shrink-0">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setAttachedImages((prev) => prev.filter((i) => i.id !== img.id))}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input box */}
            <div className={`bg-[#1e1e1e] border rounded-xl overflow-hidden transition-colors ${isDragOver ? "border-[#0066ff]/60" : "border-white/12 focus-within:border-[#0066ff]/60"}`}>
              <textarea
                ref={textareaRef}
                value={aiInput}
                onChange={handleTextareaInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiSend(); }
                }}
                placeholder={aiLoading ? "Type to queue next message…" : "Ask Diamond anything…"}
                rows={1}
                className="w-full bg-transparent px-3 pt-3 pb-1 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none leading-relaxed"
                style={{ minHeight: "40px", maxHeight: "140px" }}
              />
              <div className="flex items-center justify-between px-3 pb-2 pt-1 gap-2">
                {/* Attach image button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-6 h-6 flex items-center justify-center text-white/25 hover:text-white/60 rounded transition-colors shrink-0"
                  title="Attach image"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-white/20 font-mono flex-1 text-center">
                  {aiLoading ? "will queue after current task" : "⏎ send · ⇧⏎ newline"}
                </span>
                <button
                  onClick={() => handleAiSend()}
                  disabled={!aiInput.trim() && attachedImages.length === 0}
                  className="w-7 h-7 flex items-center justify-center bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-white/15 font-mono text-center">Drag & drop images · AI may make mistakes</p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="h-5 bg-[#0066ff] flex items-center px-4 gap-4 text-[10px] text-white/70 shrink-0 font-mono">
        <span>{activeFile ? getLang(activeFile.slug).toUpperCase() : ""}</span>
        <span className="flex-1" />
        <span>{pages?.length ?? 0} files</span>
        {anyUnsaved && <span className="text-white">● Unsaved</span>}
        <span className="hidden sm:inline">Ctrl+S to save all</span>
      </div>

      {/* ── DEPLOY DIALOG ── */}
      <Dialog open={deployOpen} onOpenChange={setDeployOpen}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-white/10 rounded-xl text-white p-0 overflow-y-auto max-h-[90vh]">
          {deployStep === "live" ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Site is live!</p>
                  <p className="text-xs text-white/40 font-mono">Deployed successfully</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/8 rounded-lg px-3 py-2.5">
                <Globe className="w-4 h-4 text-[#0066ff] shrink-0" />
                <span className="flex-1 text-sm font-mono text-blue-300 truncate">{publishedUrl}</span>
                <button onClick={() => { if (publishedUrl) { navigator.clipboard.writeText(publishedUrl); toast({ title: "Copied!" }); } }}
                  className="text-white/30 hover:text-white transition-colors shrink-0">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {deployTab === "domain" && platformDomain && domainInput && (
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-xs font-mono text-amber-400/80 font-semibold mb-1">DNS reminder</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    CNAME <span className="text-white/60 font-mono">{domainInput}</span> → <span className="text-emerald-400 font-mono">{platformDomain}</span>
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={() => setDeployOpen(false)}
                  className="flex-1 border-white/10 text-white/60 hover:text-white rounded-lg font-mono text-xs">
                  Close
                </Button>
                <Button onClick={() => window.open(publishedUrl!, "_blank")}
                  className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] text-white rounded-lg font-mono text-xs">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open Site
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-6 pt-6 pb-4 border-b border-white/6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
                    <div className="w-8 h-8 rounded-lg bg-[#0066ff]/15 border border-[#0066ff]/25 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-[#0066ff]" />
                    </div>
                    Deploy Site
                  </DialogTitle>
                </DialogHeader>
                <div className="flex gap-1 mt-4 bg-black/30 rounded-lg p-1">
                  <button
                    onClick={() => setDeployTab("quick")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-mono transition-colors ${deployTab === "quick" ? "bg-[#0066ff] text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <Rocket className="w-3 h-3" /> Quick Deploy
                  </button>
                  <button
                    onClick={() => setDeployTab("domain")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-mono transition-colors ${deployTab === "domain" ? "bg-[#0066ff] text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <Link2 className="w-3 h-3" /> Custom Domain
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {deployTab === "quick" && (
                  <>
                    <div className="bg-[#0066ff]/8 border border-[#0066ff]/20 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-white">Deploy instantly</p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Go live right now on the platform's URL — no DNS setup needed.
                      </p>
                      {publishedUrl && (
                        <div className="flex items-center gap-2 bg-black/30 border border-white/8 rounded-md px-2.5 py-1.5 mt-2">
                          <Globe className="w-3 h-3 text-[#0066ff] shrink-0" />
                          <span className="flex-1 text-[11px] font-mono text-blue-300 truncate">{publishedUrl}</span>
                          <button onClick={() => { navigator.clipboard.writeText(publishedUrl!); toast({ title: "Copied!" }); }}
                            className="text-white/30 hover:text-white shrink-0 transition-colors">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setDeployOpen(false)}
                        className="flex-1 border-white/10 text-white/50 hover:text-white rounded-lg font-mono text-xs h-9">
                        Cancel
                      </Button>
                      <Button onClick={() => handlePublish(false)} disabled={publishing}
                        className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-40 text-white rounded-lg font-mono text-xs h-9 font-bold">
                        {publishing ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deploying…</> : <><Rocket className="w-3.5 h-3.5 mr-1.5" />Deploy Now</>}
                      </Button>
                    </div>
                  </>
                )}

                {deployTab === "domain" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-white/50">Client's custom domain</label>
                      <div className="flex items-center bg-black/30 border border-white/10 focus-within:border-[#0066ff]/60 rounded-lg overflow-hidden transition-colors">
                        <span className="px-3 text-xs font-mono text-white/30 bg-white/4 border-r border-white/8 h-10 flex items-center shrink-0">https://</span>
                        <input
                          type="text"
                          value={domainInput}
                          onChange={(e) => setDomainInput(e.target.value.replace(/^https?:\/\//i, ""))}
                          onKeyDown={(e) => { if (e.key === "Enter" && domainInput.trim()) handlePublish(true); }}
                          placeholder="myclient.com"
                          className="flex-1 bg-transparent px-3 py-2.5 text-sm font-mono text-white placeholder:text-white/25 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono text-white/35 uppercase tracking-wider">DNS record to add</p>
                      <div className="bg-black/40 border border-white/8 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-3 border-b border-white/6 text-[10px] font-mono text-white/25 px-3 py-1.5 bg-white/2">
                          <span>TYPE</span><span>NAME</span><span>VALUE</span>
                        </div>
                        <div className="grid grid-cols-3 px-3 py-2.5 text-xs font-mono">
                          <span className="text-amber-400">CNAME</span>
                          <span className="text-white/50">@</span>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-emerald-400 truncate">{platformDomain || "softwarediamond.com"}</span>
                            {platformDomain && (
                              <button onClick={() => { navigator.clipboard.writeText(platformDomain); toast({ title: "Copied!" }); }}
                                className="text-white/20 hover:text-white/60 shrink-0 transition-colors">
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setDeployOpen(false)}
                        className="flex-1 border-white/10 text-white/50 hover:text-white rounded-lg font-mono text-xs h-9">
                        Cancel
                      </Button>
                      <Button onClick={() => handlePublish(true)} disabled={publishing || !domainInput.trim()}
                        className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-40 text-white rounded-lg font-mono text-xs h-9 font-bold">
                        {publishing ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deploying…</> : <><Globe className="w-3.5 h-3.5 mr-1.5" />Deploy to {domainInput.trim() || "domain"}</>}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {site && <SiteSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} site={site} updateSite={updateSite} queryClient={queryClient} />}
    </div>
  );
}

// ─── AI Message Component ─────────────────────────────────────────────────────

function AiMessage({ msg, onSuggestion }: { msg: AiMsg; onSuggestion: (s: string) => void }) {
  if (msg.role === "welcome") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#0066ff] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 bg-white/4 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-3 space-y-1.5">
            <p className="text-sm text-white font-semibold">Hey! I'm Diamond.</p>
            <p className="text-sm text-white/70 leading-relaxed">
              I build websites — and I'm not shy about asking questions to make sure I get it exactly right. Tell me what you need, drop in images for reference, and let's make something great.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pl-8">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => onSuggestion(s)}
              className="text-left text-xs text-white/50 hover:text-white/80 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-lg px-3 py-2 transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (msg.role === "thinking") {
    return (
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md bg-[#0066ff] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 bg-white/4 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-3">
          <div className="flex items-center gap-2 text-white/40">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066ff]" />
            <span className="text-xs font-mono">Diamond is thinking…</span>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0066ff]/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (msg.role === "queued") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] space-y-1">
          <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white/50 leading-relaxed">
            {msg.text}
          </div>
          <div className="flex items-center justify-end gap-1 pr-1">
            <div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono text-amber-400/70">queued #{msg.position}</span>
          </div>
        </div>
      </div>
    );
  }

  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] space-y-1.5">
          {/* Image thumbnails */}
          {msg.images && msg.images.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end">
              {msg.images.map((img) => (
                <div key={img.id} className="w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {/* Text bubble */}
          {msg.text && (
            <div className="bg-[#0066ff] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white leading-relaxed">
              {msg.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (msg.role === "assistant") {
    return (
      <div className="flex items-start gap-2.5">
        <div className="w-6 h-6 rounded-md bg-[#0066ff] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-white/4 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-3">
            <MarkdownText text={msg.text} />
          </div>
          {msg.mode === "build" && msg.files && msg.files.length > 0 && (
            <div className="bg-[#0d1f0d] border border-emerald-500/20 rounded-xl px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-wider mb-2">Files generated</p>
              {msg.files.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <FileIcon slug={f} className="w-3 h-3 shrink-0 opacity-50" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Settings Dialog ──────────────────────────────────────────────────────────

function SiteSettingsDialog({ open, onClose, site, updateSite, queryClient }: any) {
  const [domain, setDomain] = useState(site.domain || "");
  const [clientEmail, setClientEmail] = useState(site.clientEmail || "");
  const [status, setStatus] = useState(site.status);
  const { toast } = useToast();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-[#1a1a1a] border-white/10 rounded-xl text-white">
        <DialogHeader><DialogTitle className="font-mono text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> Site Settings</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          {[
            { label: "Domain / URL", value: domain, set: setDomain, placeholder: "www.example.com" },
            { label: "Client Email", value: clientEmail, set: setClientEmail, placeholder: "client@company.com" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-1.5 block">{label}</label>
              <Input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} className="bg-[#0e0e0e] border-white/10 rounded-lg font-mono text-white h-9 text-sm" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#0e0e0e] border border-white/10 text-white text-sm h-9 px-3 font-mono rounded-lg focus:outline-none">
              {["draft", "building", "review", "paused", "live"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-white rounded-lg font-mono text-xs">Cancel</Button>
            <Button
              onClick={() => updateSite.mutate({ id: site.id, data: { domain, clientEmail, status } }, { onSuccess: () => { toast({ title: "Saved" }); queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(site.id) }); onClose(); } })}
              disabled={updateSite.isPending}
              className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] text-white rounded-lg font-mono text-xs font-bold"
            >
              {updateSite.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
