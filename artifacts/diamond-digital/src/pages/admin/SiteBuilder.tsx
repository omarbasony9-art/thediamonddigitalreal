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
  Copy, AlertTriangle, ChevronRight,
  Sparkles, Send, Bot, Loader2, Files, Globe, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type FileItem = { id: number; title: string; slug: string; content: string; order: number };
type AiMsg = { role: "user" | "ai" | "system"; text: string };

const getLang = (slug: string) => {
  if (slug.endsWith(".html")) return "html";
  if (slug.endsWith(".css")) return "css";
  if (slug.endsWith(".js")) return "javascript";
  if (slug.endsWith(".ts")) return "typescript";
  if (slug.endsWith(".json")) return "json";
  if (slug.endsWith(".md")) return "markdown";
  return "plaintext";
};
const getIcon = (slug: string) =>
  slug.endsWith(".html") ? "🌐" : slug.endsWith(".css") ? "🎨" : slug.endsWith(".js") ? "⚡" : "📄";

const buildPreview = (files: FileItem[]) => {
  const html = files.find((f) => getLang(f.slug) === "html");
  if (!html) return `<html><body style="font:14px system-ui;color:#666;padding:48px;text-align:center;background:#111"><p>No HTML file yet.</p></body></html>`;
  let doc = html.content;
  const styles = files.filter((f) => getLang(f.slug) === "css").map((f) => `<style>${f.content}</style>`).join("\n");
  const scripts = files.filter((f) => getLang(f.slug) === "javascript").map((f) => `<script>${f.content}<\/script>`).join("\n");
  doc = doc.includes("</head>") ? doc.replace("</head>", `${styles}\n</head>`) : styles + doc;
  doc = doc.includes("</body>") ? doc.replace("</body>", `${scripts}\n</body>`) : doc + scripts;
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
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <section class="hero">
    <h1>Build Something Amazing</h1>
    <p>Describe your website to the AI on the left and watch it come to life in seconds.</p>
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
.btn:hover { opacity: .85; }
footer { text-align: center; padding: 2rem; color: #555; border-top: 1px solid rgba(255,255,255,.06); }` },
  { title: "script.js", slug: "script.js", order: 2, content: `console.log('Site loaded!');` },
];

export default function SiteBuilder() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [previewDoc, setPreviewDoc] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [addingFile, setAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const [leftTab, setLeftTab] = useState<"files" | "ai">("ai");
  const [aiMessages, setAiMessages] = useState<AiMsg[]>([
    { role: "system", text: "I build complete, professional websites from a single description.\n\nTry:\n• \"Dark barbershop with neon green accents, booking section & gallery\"\n• \"Luxury real estate agency with full-screen hero and property listings\"\n• \"Minimalist SaaS landing page with pricing table and testimonials\"\n• \"Gym website with bold typography, class schedule and trainer bios\"\n\nBe specific — the more detail you give, the better the result." },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState<"fresh" | "improve">("fresh");
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<typeof pages>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

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
      const html = pages.find((p) => p.slug.endsWith(".html")) || pages[0];
      setActiveFileId(html.id);
      setEditedContent(html.content);
    }
  }, [pages, activeFileId]);

  // Debounced live preview
  useEffect(() => {
    if (!pages) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const merged = pages.map((p) => (p.id === activeFileId ? { ...p, content: editedContent } : p));
      setPreviewDoc(buildPreview(merged as FileItem[]));
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [editedContent, pages, activeFileId]);

  useEffect(() => {
    if (pages && pages.length > 0) setPreviewDoc(buildPreview(pages as FileItem[]));
  }, [pages]);

  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages]);

  // Restore publishedUrl from site.domain if it looks like our hosted URL
  useEffect(() => {
    if (site?.domain && site.domain.includes("/api/s/")) setPublishedUrl(site.domain);
  }, [site]);

  const activeFile = pages?.find((p) => p.id === activeFileId) || pages?.[0];
  const hasUnsaved = activeFile && editedContent !== activeFile.content;

  const switchFile = useCallback((file: FileItem) => {
    setActiveFileId(file.id);
    setEditedContent(file.content);
  }, []);

  const handleSave = useCallback(() => {
    if (!activeFile) return;
    updatePage.mutate(
      { id, pageId: activeFile.id, data: { content: editedContent, title: activeFile.title } },
      {
        onSuccess: () => {
          toast({ title: "Saved ✓" });
          queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
          const merged = (pages || []).map((p) => p.id === activeFile.id ? { ...p, content: editedContent } : p);
          setPreviewDoc(buildPreview(merged as FileItem[]));
          setPreviewKey((k) => k + 1);
        },
      }
    );
  }, [activeFile, editedContent, pages, id]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${import.meta.env.BASE_URL}api/sites/${id}/publish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setPublishedUrl(data.publishedUrl);
      setPublishOpen(true);
      queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(id) });
      toast({ title: "🚀 Published!", description: "Your site is live." });
    } catch (err: any) {
      toast({ title: "Publish failed", description: err.message, variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    let slug = newFileName.trim();
    if (!slug.includes(".")) slug += ".html";
    createPage.mutate(
      { id, data: { title: slug, slug, content: `<!-- ${slug} -->\n` } },
      { onSuccess: (f) => { queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) }); setActiveFileId(f.id); setEditedContent(f.content); setNewFileName(""); setAddingFile(false); toast({ title: `Created ${slug}` }); } }
    );
  };

  const handleDeleteFile = (fileId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this file?")) return;
    deletePage.mutate({ id, pageId: fileId }, {
      onSuccess: () => { if (activeFileId === fileId) { setActiveFileId(null); setEditedContent(""); } queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) }); },
    });
  };

  const handleAiSend = async () => {
    const prompt = aiInput.trim();
    if (!prompt || aiLoading) return;
    setAiInput("");

    const currentPages = pagesRef.current || [];
    const existingFiles = aiMode === "improve"
      ? currentPages.map((p) => ({ name: p.slug, content: p.id === activeFileId ? editedContent : p.content }))
      : [];

    setAiMessages((prev) => [
      ...prev,
      { role: "user", text: prompt },
      { role: "ai", text: "__loading__" },
    ]);
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

      const { html, css, js } = data.files;
      const fileMap: Record<string, string> = {
        "index.html": html,
        ...(css ? { "style.css": css } : {}),
        ...(js ? { "script.js": js } : {}),
      };

      await Promise.all(
        Object.entries(fileMap).map(([slug, content]) => {
          const existing = currentPages.find((p) => p.slug === slug);
          return new Promise<void>((resolve) => {
            if (existing) {
              updatePage.mutate({ id, pageId: existing.id, data: { content, title: existing.title } }, { onSuccess: () => resolve(), onError: () => resolve() });
            } else {
              createPage.mutate({ id, data: { title: slug, slug, content } }, { onSuccess: () => resolve(), onError: () => resolve() });
            }
          });
        })
      );

      await queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });

      const freshPages = pagesRef.current || currentPages;
      const htmlPage = freshPages.find((p) => p.slug === "index.html");
      if (htmlPage) { setActiveFileId(htmlPage.id); setEditedContent(html); }

      const merged = freshPages.map((p) => {
        if (p.slug === "index.html" && html) return { ...p, content: html };
        if (p.slug === "style.css" && css) return { ...p, content: css };
        if (p.slug === "script.js" && js) return { ...p, content: js };
        return p;
      });
      setPreviewDoc(buildPreview(merged as FileItem[]));
      setPreviewKey((k) => k + 1);

      setAiMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "ai",
          text: "✅ Done! Your website is ready — check the preview on the right.\n\nWant to refine it? Switch to **Improve** mode and tell me what to change.",
        };
        return copy;
      });
      toast({ title: "✨ Website built!" });
    } catch (err: any) {
      setAiMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "ai", text: `❌ ${err.message}. Please try again.` };
        return copy;
      });
    } finally {
      setAiLoading(false);
    }
  };

  const isLive = site?.status === "live";

  return (
    <div className="h-screen w-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* TOP BAR */}
      <div className="h-11 bg-[#161616] border-b border-white/8 flex items-center px-3 gap-2 shrink-0">
        <Link href="/admin/sites">
          <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-white/40 font-mono text-xs truncate">{site?.clientName}</span>
          <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
          <span className="text-white font-semibold truncate">{site?.projectName || "Loading…"}</span>
        </div>
        {isLive && (
          <span className="px-2 py-0.5 text-[10px] font-mono tracking-wider bg-emerald-500/20 text-emerald-400 shrink-0">LIVE</span>
        )}
        <div className="flex-1" />
        <button onClick={() => setSettingsOpen(true)} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors">
          <Settings className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { const m = (pages || []).map((p) => (p.id === activeFileId ? { ...p, content: editedContent } : p)); setPreviewDoc(buildPreview(m as FileItem[])); setPreviewKey((k) => k + 1); }}
          className="flex items-center gap-1.5 px-2.5 h-7 bg-white/8 hover:bg-white/12 text-white/60 text-xs font-mono rounded transition-colors">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
        {hasUnsaved && (
          <button onClick={handleSave} disabled={updatePage.isPending}
            className="flex items-center gap-1.5 px-3 h-7 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono rounded font-bold transition-colors">
            {updatePage.isPending ? "Saving…" : "Save"}
          </button>
        )}
        {isLive && publishedUrl ? (
          <button onClick={() => setPublishOpen(true)}
            className="flex items-center gap-1.5 px-3 h-7 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono rounded transition-colors hover:bg-emerald-600/30">
            <Globe className="w-3 h-3" /> View Live
          </button>
        ) : (
          <button onClick={handlePublish} disabled={publishing}
            className="flex items-center gap-1.5 px-3 h-7 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-mono font-bold rounded transition-colors">
            {publishing ? <><Loader2 className="w-3 h-3 animate-spin" /> Publishing…</> : <><Globe className="w-3 h-3" /> Publish</>}
          </button>
        )}
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className={`flex flex-col border-r border-white/8 shrink-0 bg-[#1a1a2e] ${leftTab === "ai" ? "w-80" : "w-52"}`}>
          <div className="flex border-b border-white/8 shrink-0">
            <button onClick={() => setLeftTab("files")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-mono transition-colors flex-1 justify-center ${leftTab === "files" ? "text-white border-b-2 border-primary bg-[#252526]" : "text-white/40 hover:text-white/70"}`}>
              <Files className="w-3.5 h-3.5" /> Files
            </button>
            <button onClick={() => setLeftTab("ai")}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-mono transition-colors flex-1 justify-center ${leftTab === "ai" ? "text-violet-300 border-b-2 border-violet-400" : "text-white/40 hover:text-violet-300/70"}`}>
              <Sparkles className="w-3.5 h-3.5" /> AI Builder
            </button>
          </div>

          {/* FILES */}
          {leftTab === "files" && (
            <div className="flex-1 bg-[#252526] overflow-y-auto">
              <div className="px-3 py-2 text-[10px] font-mono text-white/30 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                <span>Explorer</span>
                <button onClick={() => setAddingFile(true)} className="hover:text-white/60"><Plus className="w-3 h-3" /></button>
              </div>
              {pagesLoading ? (
                <div className="px-4 py-3 text-xs text-white/30 font-mono">Loading…</div>
              ) : pages?.map((file) => {
                const active = file.id === activeFileId;
                return (
                  <div key={file.id} onClick={() => switchFile(file as FileItem)}
                    className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}>
                    <div className="flex items-center gap-2 text-xs font-mono truncate">
                      <span className="shrink-0">{getIcon(file.slug)}</span>
                      <span className="truncate">{file.slug}</span>
                      {active && hasUnsaved && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                    </div>
                    <button onClick={(e) => handleDeleteFile(file.id, e)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all shrink-0 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {addingFile && (
                <div className="px-3 py-2 border-t border-white/5">
                  <Input autoFocus value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddFile(); if (e.key === "Escape") setAddingFile(false); }}
                    placeholder="filename.html" className="h-6 text-xs font-mono bg-white/10 border-white/20 rounded-none px-2 text-white placeholder:text-white/30" />
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={handleAddFile} className="text-[10px] font-mono text-primary hover:text-primary/80">Create</button>
                    <button onClick={() => { setAddingFile(false); setNewFileName(""); }} className="text-[10px] font-mono text-white/30 hover:text-white/60">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI */}
          {leftTab === "ai" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 shrink-0 bg-[#13131f]">
                <button onClick={() => setAiMode("fresh")}
                  className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${aiMode === "fresh" ? "bg-violet-500/25 text-violet-200 border border-violet-500/40" : "text-white/40 hover:text-white/60 border border-white/8"}`}>
                  ✨ Build Fresh
                </button>
                <button onClick={() => setAiMode("improve")}
                  className={`flex-1 py-1 text-[10px] font-mono rounded transition-colors ${aiMode === "improve" ? "bg-blue-500/25 text-blue-200 border border-blue-500/40" : "text-white/40 hover:text-white/60 border border-white/8"}`}>
                  🔧 Improve
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {aiMessages.map((msg, i) => (
                  <div key={i}>
                    {msg.role === "user" && (
                      <div className="flex justify-end">
                        <div className="max-w-[90%] bg-violet-600/30 border border-violet-500/30 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-violet-100">{msg.text}</div>
                      </div>
                    )}
                    {msg.role === "ai" && (
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3 h-3 text-violet-400" />
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-3 py-2.5 text-sm text-white/85 leading-relaxed">
                          {msg.text === "__loading__" ? (
                            <div className="flex items-center gap-2 text-white/50">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                              <span className="text-xs font-mono animate-pulse">Building your website…</span>
                            </div>
                          ) : (
                            <span className="whitespace-pre-wrap">{msg.text}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {msg.role === "system" && (
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                        </div>
                        <div className="flex-1 text-xs text-white/50 leading-relaxed whitespace-pre-wrap pt-1">{msg.text}</div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              <div className="p-3 border-t border-white/8 bg-[#13131f] shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiSend(); } }}
                    placeholder={aiMode === "fresh" ? "Describe the website you want…" : "What should I change or add?"}
                    rows={3}
                    disabled={aiLoading}
                    className="flex-1 bg-[#252540] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-violet-500/60 disabled:opacity-50 leading-relaxed"
                  />
                  <button onClick={handleAiSend} disabled={!aiInput.trim() || aiLoading}
                    className="w-9 h-9 flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors shrink-0 mb-0.5">
                    {aiLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                  </button>
                </div>
                <p className="text-[9px] text-white/20 mt-1.5 font-mono text-center">Enter to send · Shift+Enter for newline</p>
              </div>
            </div>
          )}
        </div>

        {/* EDITOR */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-9 bg-[#252526] border-b border-white/8 flex items-end overflow-x-auto shrink-0">
            {pages?.map((file) => {
              const active = file.id === activeFileId;
              return (
                <button key={file.id} onClick={() => switchFile(file as FileItem)}
                  className={`flex items-center gap-1.5 px-4 h-full text-xs font-mono transition-colors shrink-0 border-r border-white/5 ${active ? "bg-[#1e1e1e] text-white border-t-2 border-t-primary" : "text-white/40 hover:text-white/70 hover:bg-white/4"}`}>
                  <span>{getIcon(file.slug)}</span>
                  {file.slug}
                  {active && hasUnsaved && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </button>
              );
            })}
            <button onClick={() => { setLeftTab("files"); setAddingFile(true); }}
              className="flex items-center gap-1 px-3 h-full text-white/30 hover:text-white/60 hover:bg-white/4 text-xs transition-colors shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {activeFile ? (
            <Editor height="100%" language={getLang(activeFile.slug)} value={editedContent}
              onChange={(v) => setEditedContent(v || "")} theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 13, tabSize: 2, wordWrap: "off", scrollBeyondLastLine: false, automaticLayout: true, fontFamily: "'JetBrains Mono','Fira Code','Consolas',monospace", fontLigatures: true, cursorBlinking: "smooth", smoothScrolling: true, padding: { top: 14, bottom: 14 }, lineNumbers: "on", bracketPairColorization: { enabled: true } }}
              onMount={(editor) => { editor.addAction({ id: "save", label: "Save", keybindings: [2097], run: handleSave }); }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20 flex-col gap-3">
              <FileCode className="w-10 h-10" />
              <p className="text-sm font-mono">Select a file to edit</p>
            </div>
          )}
        </div>

        {/* PREVIEW */}
        <div className="w-[40%] flex flex-col border-l border-white/8 shrink-0">
          <div className="h-8 bg-[#2d2d2d] flex items-center px-3 gap-2 shrink-0 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="flex-1 mx-2 bg-[#1e1e1e] rounded text-[10px] font-mono text-white/25 px-2 py-0.5 truncate">
              {publishedUrl || "preview"}
            </div>
            <button onClick={() => { const m = (pages || []).map((p) => (p.id === activeFileId ? { ...p, content: editedContent } : p)); setPreviewDoc(buildPreview(m as FileItem[])); setPreviewKey((k) => k + 1); }}
              className="text-white/25 hover:text-white/60 transition-colors" title="Refresh preview">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <iframe key={previewKey} srcDoc={previewDoc} sandbox="allow-scripts" className="flex-1 w-full border-none bg-white" title="preview" />
        </div>
      </div>

      {/* STATUS BAR */}
      <div className="h-5 bg-[#007acc] flex items-center px-4 gap-4 text-[10px] text-white/70 shrink-0 font-mono">
        <span>{activeFile ? getLang(activeFile.slug).toUpperCase() : ""}</span>
        <span className="flex-1" />
        <span>{pages?.length ?? 0} files</span>
        {hasUnsaved && <span className="text-amber-200">● Unsaved</span>}
        <span>Ctrl+S to save</span>
      </div>

      {/* PUBLISH SUCCESS DIALOG */}
      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent className="sm:max-w-md bg-[#1a1a2e] border-violet-500/30 rounded-xl text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Site is Live!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <p className="text-sm text-white/60">Your website is publicly accessible at:</p>
            <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg px-3 py-2.5">
              <Globe className="w-4 h-4 text-violet-400 shrink-0" />
              <span className="flex-1 text-sm font-mono text-violet-200 truncate">{publishedUrl}</span>
              <button onClick={() => { if (publishedUrl) { navigator.clipboard.writeText(publishedUrl); toast({ title: "Copied!" }); } }}
                className="text-white/40 hover:text-white transition-colors shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPublishOpen(false)} className="flex-1 border-white/10 text-white/70 hover:text-white rounded-lg font-mono text-xs">
                Close
              </Button>
              <Button onClick={() => window.open(publishedUrl!, "_blank")}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-mono text-xs">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open Site
              </Button>
            </div>
            <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-3 text-xs text-amber-200/70 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
              This URL is hosted by Replit and is always live. To use a custom domain like <span className="font-mono">www.yoursite.com</span>, point your domain's DNS to this URL or use a service like Cloudflare to proxy it.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SETTINGS */}
      {site && <SiteSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} site={site} updateSite={updateSite} queryClient={queryClient} />}
    </div>
  );
}

function SiteSettingsDialog({ open, onClose, site, updateSite, queryClient }: any) {
  const [domain, setDomain] = useState(site.domain || "");
  const [clientEmail, setClientEmail] = useState(site.clientEmail || "");
  const [status, setStatus] = useState(site.status);
  const { toast } = useToast();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-[#252526] border-white/10 rounded-none text-white">
        <DialogHeader><DialogTitle className="font-mono text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> Site Settings</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          {[
            { label: "Domain / URL", value: domain, set: setDomain, placeholder: "www.example.com" },
            { label: "Client Email", value: clientEmail, set: setClientEmail, placeholder: "client@company.com" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5 block">{label}</label>
              <Input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} className="bg-[#1e1e1e] border-white/10 rounded-none font-mono text-white h-9 text-sm" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#1e1e1e] border border-white/10 text-white text-sm h-9 px-3 font-mono rounded-none focus:outline-none">
              {["draft", "building", "review", "paused", "live"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-white rounded-none font-mono text-xs">Cancel</Button>
            <Button onClick={() => updateSite.mutate({ id: site.id, data: { domain, clientEmail, status } }, { onSuccess: () => { toast({ title: "Saved" }); queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(site.id) }); onClose(); } })}
              disabled={updateSite.isPending} className="flex-1 bg-primary text-[#0a0a10] hover:bg-primary/90 rounded-none font-mono text-xs font-bold">
              {updateSite.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
