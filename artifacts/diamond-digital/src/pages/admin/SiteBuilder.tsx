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
  FileJson, FileCog, File, Rocket, Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type FileItem = { id: number; title: string; slug: string; content: string; order: number };
type AiMsg =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; files?: string[] }
  | { role: "thinking" }
  | { role: "queued"; text: string; position: number }
  | { role: "welcome" };

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

/**
 * Build preview doc by inlining CSS and JS into the HTML.
 * Uses the editMap (in-memory unsaved edits) over DB content so switching
 * tabs never loses edits from other files in the live preview.
 * Injects a navigation interceptor so clicking <a href="page.html"> sends
 * a postMessage to the parent instead of blanking the iframe.
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
  // Intercept internal link clicks so navigation works in the sandboxed preview
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
  // Track unsaved edits for ALL files — keyed by file id.
  // This is the source-of-truth for "current content" while editing.
  // Switching tabs NEVER clears another file's edits.
  const editMapRef = useRef<Map<number, string>>(new Map());
  const [editMapVersion, setEditMapVersion] = useState(0); // bump to force re-renders
  const bumpEditMap = () => setEditMapVersion((v) => v + 1);

  const [aiMessages, setAiMessages] = useState<AiMsg[]>([{ role: "welcome" }]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  const messageQueueRef = useRef<string[]>([]);
  const aiLoadingRef = useRef(false); // sync ref mirrors aiLoading for use inside async callbacks
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<typeof pages>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Select index.html on initial load
  useEffect(() => {
    if (pages && pages.length > 0 && activeFileId === null) {
      const html = pages.find((p) => p.slug === "index.html") || pages.find((p) => p.slug.endsWith(".html")) || pages[0];
      setActiveFileId(html.id);
    }
  }, [pages, activeFileId]);

  // Rebuild preview (debounced) whenever edit map or pages change
  useEffect(() => {
    if (!pages) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewDoc(buildPreview(pages as FileItem[], editMapRef.current, previewPage));
    }, 400);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMapVersion, pages, previewPage]);

  // When pages first arrive (or DB refreshes), set initial preview immediately
  useEffect(() => {
    if (pages && pages.length > 0) {
      setPreviewDoc(buildPreview(pages as FileItem[], editMapRef.current, previewPage));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  // Intercept in-preview link clicks — swap the rendered page instead of blanking
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== "preview-navigate") return;
      const target: string = e.data.page || "index.html";
      const slug = target.split("/").pop() || target; // strip any path prefix
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
  // "Current" content for the active file: prefer in-memory edit, fall back to DB
  const activeContent = activeFileId !== null && editMapRef.current.has(activeFileId)
    ? editMapRef.current.get(activeFileId)!
    : (activeFile?.content ?? "");
  // Dirty = in-memory edit differs from DB
  const hasUnsaved = activeFile && editMapRef.current.has(activeFile.id) && editMapRef.current.get(activeFile.id) !== activeFile.content;
  const anyUnsaved = pages?.some((p) => editMapRef.current.has(p.id) && editMapRef.current.get(p.id) !== p.content);

  const handleEditorChange = useCallback((val: string | undefined) => {
    if (activeFileId === null) return;
    editMapRef.current.set(activeFileId, val ?? "");
    bumpEditMap();
  }, [activeFileId]);

  // Switching tabs is instant — no data loss
  const switchFile = useCallback((file: FileItem) => {
    setActiveFileId(file.id);
    // If the file has no in-memory edit yet, seed from DB
    if (!editMapRef.current.has(file.id)) {
      editMapRef.current.set(file.id, file.content);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!pages) return;
    // Save all dirty files
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
    // After save, rebuild preview with latest
    const fresh = pagesRef.current;
    if (fresh) setPreviewDoc(buildPreview(fresh as FileItem[], editMapRef.current, previewPage));
    setPreviewKey((k) => k + 1);
    toast({ title: `Saved ${dirty.length} file${dirty.length > 1 ? "s" : ""} ✓` });
  }, [pages, id, updatePage, queryClient, toast]);

  const openDeployDialog = async () => {
    const existingDomain = site?.domain && !site.domain.startsWith("http") ? site.domain : "";
    setDomainInput(existingDomain);
    setDeployStep("form");
    setDeployTab(existingDomain ? "domain" : "quick");
    setDeployOpen(true);
    // Fetch platform domain for CNAME instructions
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

  // Core AI execution — always runs one prompt immediately
  const runAiPrompt = async (prompt: string) => {
    const currentPages = pagesRef.current || [];
    const existingFiles = currentPages.map((p) => ({
      name: p.slug,
      content: editMapRef.current.has(p.id) ? editMapRef.current.get(p.id)! : p.content,
    }));

    setAiMessages((prev) => [...prev, { role: "user", text: prompt }, { role: "thinking" }]);
    aiLoadingRef.current = true;
    setAiLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${import.meta.env.BASE_URL}api/admin/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ description: prompt, existingFiles }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Generation failed");

      const fileList: { name: string; content: string }[] = data.files;
      const createdNames: string[] = [];

      for (const file of fileList) {
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
      const nameToContent = Object.fromEntries(fileList.map((f) => [f.name, f.content]));
      for (const p of freshPages) {
        if (nameToContent[p.slug] !== undefined) editMapRef.current.set(p.id, nameToContent[p.slug]);
      }
      bumpEditMap();

      const htmlPage = freshPages.find((p) => p.slug === "index.html") || freshPages.find((p) => p.slug.endsWith(".html"));
      if (htmlPage) setActiveFileId(htmlPage.id);
      setPreviewKey((k) => k + 1);

      setAiMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          text: `Done! Built ${createdNames.length} files with full navigation. Switch between tabs — the preview stays live.`,
          files: createdNames,
        };
        return copy;
      });
    } catch (err: any) {
      setAiMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", text: `❌ ${err.message}. Please try again.` };
        return copy;
      });
    } finally {
      aiLoadingRef.current = false;
      setAiLoading(false);
      // Process next queued message automatically
      const next = messageQueueRef.current.shift();
      setQueueLength(messageQueueRef.current.length);
      if (next) {
        // Remove the "queued" bubble for this message now that it's starting
        setAiMessages((prev) => prev.filter((m) => !(m.role === "queued" && (m as any).text === next)));
        // Small delay so the UI settles before the next request starts
        setTimeout(() => runAiPrompt(next), 150);
      }
    }
  };

  const handleAiSend = (overridePrompt?: string) => {
    const prompt = (overridePrompt ?? aiInput).trim();
    if (!prompt) return;
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }
    setAiInput("");

    if (aiLoadingRef.current) {
      // Queue it — show a "queued" bubble so the user knows it's pending
      messageQueueRef.current.push(prompt);
      const pos = messageQueueRef.current.length;
      setQueueLength(pos);
      setAiMessages((prev) => [...prev, { role: "queued", text: prompt, position: pos } as AiMsg]);
    } else {
      runAiPrompt(prompt);
    }
  };

  const isLive = site?.status === "live";

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAiInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

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
                    {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />}
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
          {/* File tabs */}
          <div className="h-9 bg-[#1e1e1e] border-b border-white/6 flex items-end overflow-x-auto shrink-0">
            {pages?.map((file) => {
              const active = file.id === activeFileId;
              const dirty = editMapRef.current.has(file.id) && editMapRef.current.get(file.id) !== file.content;
              return (
                <button key={file.id} onClick={() => switchFile(file as FileItem)}
                  className={`flex items-center gap-1.5 px-4 h-full text-[11px] font-mono transition-colors shrink-0 border-r border-white/4 ${active ? "bg-[#0e0e0e] text-white border-t-2 border-t-[#0066ff]" : "text-white/35 hover:text-white/65 hover:bg-white/3"}`}>
                  <FileIcon slug={file.slug} className="w-3 h-3 opacity-70" />
                  {file.slug}
                  {dirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved" />}
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
                {/* Browser chrome bar */}
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
                {/* Page navigation tabs — only show when there are multiple HTML files */}
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
                {/* key only changes on explicit refresh — avoids flicker on every keystroke */}
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
        <div className="w-80 shrink-0 border-l border-white/6 bg-[#141414] flex flex-col overflow-hidden">
          <div className="h-11 flex items-center px-4 border-b border-white/6 shrink-0 gap-2">
            <div className="w-5 h-5 rounded-md bg-[#0066ff] flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">AI</span>
            <span className="text-[10px] font-mono text-white/25 ml-0.5">gpt‑5.6‑sol</span>
            {queueLength > 0 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[9px] font-mono text-amber-400">
                {queueLength} queued
              </span>
            )}
            <div className="flex-1" />
            <button
              onClick={() => { setAiMessages([{ role: "welcome" }]); messageQueueRef.current = []; setQueueLength(0); }}
              className="w-7 h-7 flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/6 rounded transition-colors"
              title="New conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.map((msg, i) => (
              <AiMessage key={i} msg={msg} onSuggestion={handleAiSend} />
            ))}
            <div ref={chatBottomRef} />
          </div>

          <div className="p-3 border-t border-white/6 shrink-0">
            <div className="bg-[#1e1e1e] border border-white/12 focus-within:border-[#0066ff]/60 rounded-xl overflow-hidden transition-colors">
              <textarea
                ref={textareaRef}
                value={aiInput}
                onChange={handleTextareaInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiSend(); }
                }}
                placeholder={aiLoading ? "Type to queue next message…" : "Ask AI to build or change anything…"}
                rows={1}
                className="w-full bg-transparent px-3 pt-3 pb-1 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none leading-relaxed"
                style={{ minHeight: "40px", maxHeight: "160px" }}
              />
              <div className="flex items-center justify-between px-3 pb-2 pt-1">
                <span className="text-[10px] text-white/20 font-mono">
                  {aiLoading ? "will queue after current task" : "⏎ send · ⇧⏎ newline"}
                </span>
                <button
                  onClick={() => handleAiSend()}
                  disabled={!aiInput.trim()}
                  className="w-7 h-7 flex items-center justify-center bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {aiLoading
                    ? <Send className="w-3.5 h-3.5 text-white" />
                    : <Send className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-white/15 font-mono text-center mt-2">AI may make mistakes. Review before publishing.</p>
          </div>
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
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-white/10 rounded-xl text-white p-0 overflow-hidden">

          {/* ── SUCCESS SCREEN ── */}
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
              <p className="text-[10px] text-white/20 font-mono text-center">Deploy again anytime to push new changes.</p>
            </div>

          ) : (
            <>
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
                    <div className="w-8 h-8 rounded-lg bg-[#0066ff]/15 border border-[#0066ff]/25 flex items-center justify-center">
                      <Rocket className="w-4 h-4 text-[#0066ff]" />
                    </div>
                    Deploy Site
                  </DialogTitle>
                </DialogHeader>

                {/* Tab switcher */}
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

              {/* Tab content */}
              <div className="p-6 space-y-5">

                {/* ── QUICK DEPLOY TAB ── */}
                {deployTab === "quick" && (
                  <>
                    <div className="bg-[#0066ff]/8 border border-[#0066ff]/20 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-white">Deploy instantly</p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Go live right now on the platform's URL — no DNS setup needed. Share the link with your client immediately.
                      </p>
                      {publishedUrl && (
                        <div className="flex items-center gap-2 bg-black/30 border border-white/8 rounded-md px-2.5 py-1.5 mt-2">
                          <Globe className="w-3 h-3 text-[#0066ff] shrink-0" />
                          <span className="flex-1 text-[11px] font-mono text-blue-300 truncate">{publishedUrl}</span>
                          <button onClick={() => { navigator.clipboard.writeText(publishedUrl); toast({ title: "Copied!" }); }}
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
                        {publishing
                          ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deploying…</>
                          : <><Rocket className="w-3.5 h-3.5 mr-1.5" />Deploy Now</>}
                      </Button>
                    </div>
                  </>
                )}

                {/* ── CUSTOM DOMAIN TAB ── */}
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
                      <p className="text-[11px] text-white/25 leading-relaxed">GoDaddy, Namecheap, Cloudflare — add this record then click Deploy. DNS can take up to 48 hours.</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setDeployOpen(false)}
                        className="flex-1 border-white/10 text-white/50 hover:text-white rounded-lg font-mono text-xs h-9">
                        Cancel
                      </Button>
                      <Button onClick={() => handlePublish(true)} disabled={publishing || !domainInput.trim()}
                        className="flex-1 bg-[#0066ff] hover:bg-[#0052cc] disabled:opacity-40 text-white rounded-lg font-mono text-xs h-9 font-bold">
                        {publishing
                          ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deploying…</>
                          : <><Globe className="w-3.5 h-3.5 mr-1.5" />Deploy to {domainInput.trim() || "domain"}</>}
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

function AiMessage({ msg, onSuggestion }: { msg: AiMsg; onSuggestion: (s: string) => void }) {
  if (msg.role === "welcome") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[#0066ff] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="flex-1 text-sm text-white/80 leading-relaxed">
            Hi! Describe any website and I'll build a complete multi-page site — homepage, about, services, with unique design, real copy, and smooth animations.
          </p>
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
          <div className="flex items-center gap-2 text-white/40 mb-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066ff]" />
            <span className="text-xs font-mono">Designing & building…</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {["index.html", "about.html", "services.html", "style.css", "script.js"].map((f, i) => (
              <span key={f} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/25 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{f}</span>
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
        <div className="max-w-[85%] bg-[#0066ff] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white leading-relaxed">
          {msg.text}
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
          <div className="bg-white/4 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-3 text-sm text-white/80 leading-relaxed">
            {msg.text}
          </div>
          {msg.files && msg.files.length > 0 && (
            <div className="bg-[#0d1f0d] border border-emerald-500/20 rounded-xl px-3 py-2.5 space-y-1.5">
              <p className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-wider mb-2">Applied changes</p>
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
