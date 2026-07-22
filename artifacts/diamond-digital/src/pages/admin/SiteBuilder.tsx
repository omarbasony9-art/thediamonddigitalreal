import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "wouter";
import Editor from "@monaco-editor/react";
import {
  useGetSite,
  useUpdateSite,
  useLaunchSite,
  useListSitePages,
  useCreateSitePage,
  useUpdateSitePage,
  useDeleteSitePage,
  getGetSiteQueryKey,
  getListSitePagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Play, RefreshCw, Settings, Plus, Trash2, FileCode,
  Globe, CheckCircle2, ExternalLink, Copy, AlertTriangle, X, ChevronRight,
  Sparkles, Send, Bot, Loader2, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ── Types ──────────────────────────────────────────────────────────────────
type FileItem = { id: number; title: string; slug: string; content: string; order: number };
type AiMessage = { role: "user" | "assistant" | "system"; content: string };

// ── Helpers ────────────────────────────────────────────────────────────────
const getLang = (slug: string) => {
  if (slug.endsWith(".html")) return "html";
  if (slug.endsWith(".css")) return "css";
  if (slug.endsWith(".js")) return "javascript";
  if (slug.endsWith(".ts")) return "typescript";
  if (slug.endsWith(".json")) return "json";
  if (slug.endsWith(".md")) return "markdown";
  return "plaintext";
};

const getFileIcon = (slug: string) => {
  if (slug.endsWith(".html")) return "🌐";
  if (slug.endsWith(".css")) return "🎨";
  if (slug.endsWith(".js")) return "⚡";
  if (slug.endsWith(".ts")) return "🔷";
  return "📄";
};

const buildPreview = (files: FileItem[]) => {
  const htmlFile = files.find((f) => getLang(f.slug) === "html");
  if (!htmlFile)
    return `<html><body style="font:14px system-ui;color:#666;padding:48px;text-align:center;background:#111"><p style="margin-bottom:8px;font-size:18px">No HTML file</p><p style="font-size:13px;opacity:.6">Create an <strong>index.html</strong> file to see the preview.</p></body></html>`;

  let doc = htmlFile.content;
  const cssFiles = files.filter((f) => getLang(f.slug) === "css");
  const jsFiles = files.filter((f) => getLang(f.slug) === "javascript");

  const styles = cssFiles.map((f) => `<style>/* ${f.slug} */\n${f.content}</style>`).join("\n");
  const scripts = jsFiles.map((f) => `<script>/* ${f.slug} */\n${f.content}\n<\/script>`).join("\n");

  if (doc.includes("</head>")) doc = doc.replace("</head>", `${styles}\n</head>`);
  else doc = styles + doc;
  if (doc.includes("</body>")) doc = doc.replace("</body>", `${scripts}\n</body>`);
  else doc += scripts;

  return doc;
};

// ── Starter files ──────────────────────────────────────────────────────────
const STARTERS: Omit<FileItem, "id">[] = [
  {
    title: "index.html", slug: "index.html", order: 0,
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
</head>
<body>
  <header class="header">
    <div class="logo">My Brand</div>
    <nav>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>

  <section class="hero">
    <h1>Build Something Amazing</h1>
    <p>Your website starts here. Edit the files on the left to make it yours.</p>
    <button class="btn" onclick="handleClick()">Get Started</button>
  </section>

  <section class="features">
    <div class="card"><h3>Fast</h3><p>Built for speed and performance.</p></div>
    <div class="card"><h3>Reliable</h3><p>Always online, always working.</p></div>
    <div class="card"><h3>Beautiful</h3><p>Designed to impress visitors.</p></div>
  </section>

  <footer>
    <p>&copy; 2026 My Website. All rights reserved.</p>
  </footer>
</body>
</html>`,
  },
  {
    title: "style.css", slug: "style.css", order: 1,
    content: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0f0f1a;
  color: #e8e8f0;
  line-height: 1.6;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: sticky; top: 0;
  backdrop-filter: blur(12px);
}

.logo { font-weight: 800; font-size: 1.1rem; color: #00cfff; letter-spacing: 1px; }

nav a { color: #aaa; text-decoration: none; margin-left: 1.5rem; font-size: .9rem; transition: color .2s; }
nav a:hover { color: #fff; }

.hero {
  text-align: center;
  padding: 6rem 2rem;
  background: radial-gradient(ellipse at 50% 0%, rgba(0,207,255,.08) 0%, transparent 60%);
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #00cfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p { color: #888; font-size: 1.1rem; margin-bottom: 2rem; }

.btn {
  background: #00cfff; color: #0f0f1a;
  border: none; padding: .85rem 2rem;
  font-size: .95rem; font-weight: 700; cursor: pointer;
  letter-spacing: .5px; transition: opacity .2s;
}
.btn:hover { opacity: .85; }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem; max-width: 900px; margin: 0 auto; padding: 4rem 2rem;
}

.card {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  padding: 2rem; border-radius: 2px;
}
.card h3 { color: #00cfff; margin-bottom: .5rem; }
.card p { color: #888; font-size: .9rem; }

footer {
  text-align: center; padding: 2rem; color: #555;
  border-top: 1px solid rgba(255,255,255,.06);
  font-size: .85rem; margin-top: 4rem;
}`,
  },
  {
    title: "script.js", slug: "script.js", order: 2,
    content: `// Main JavaScript
console.log('Site loaded!');

function handleClick() {
  alert('Welcome! Edit the files to build your site.');
}

// Animate cards on scroll
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(card);
  });
});`,
  },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function SiteBuilder() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [previewDoc, setPreviewDoc] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [launchDomain, setLaunchDomain] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [addingFile, setAddingFile] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // AI state
  const [rightPanel, setRightPanel] = useState<"preview" | "ai">("preview");
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    { role: "system", content: "👋 Hi! Describe the website you want and I'll build it for you. Be as detailed as you like — industry, colors, sections, style, anything." },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<"fresh" | "improve">("fresh");
  const aiChatRef = useRef<HTMLDivElement>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: site } = useGetSite(id, { query: { queryKey: getGetSiteQueryKey(id) } });
  const { data: pages, isLoading: pagesLoading } = useListSitePages(id, {
    query: { queryKey: getListSitePagesQueryKey(id) },
  });

  const updateSite = useUpdateSite();
  const launchSite = useLaunchSite();
  const createPage = useCreateSitePage();
  const updatePage = useUpdateSitePage();
  const deletePage = useDeleteSitePage();

  // Seed starter files when no pages exist
  useEffect(() => {
    if (seeding || pagesLoading || (pages && pages.length > 0)) return;
    if (!pages) return;
    setSeeding(true);
    const seedFiles = async () => {
      for (const starter of STARTERS) {
        await new Promise<void>((resolve) => {
          createPage.mutate(
            { id, data: { title: starter.title, slug: starter.slug, content: starter.content } },
            { onSuccess: () => resolve(), onError: () => resolve() }
          );
        });
      }
      queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
    };
    seedFiles();
  }, [pages, pagesLoading]);

  // Set active file on first load
  useEffect(() => {
    if (pages && pages.length > 0 && activeFileId === null) {
      const html = pages.find((p) => p.slug.endsWith(".html")) || pages[0];
      setActiveFileId(html.id);
      setEditedContent(html.content);
    }
  }, [pages, activeFileId]);

  // Sync edited content when switching files
  const switchFile = useCallback((file: FileItem) => {
    setActiveFileId(file.id);
    setEditedContent(file.content);
  }, []);

  // Auto-preview with debounce
  useEffect(() => {
    if (!pages) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const activeFile = pages.find((p) => p.id === activeFileId);
      if (!activeFile) return;
      const merged = pages.map((p) => (p.id === activeFileId ? { ...p, content: editedContent } : p));
      setPreviewDoc(buildPreview(merged as FileItem[]));
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [editedContent, pages, activeFileId]);

  // Initial preview
  useEffect(() => {
    if (pages && pages.length > 0) {
      setPreviewDoc(buildPreview(pages as FileItem[]));
    }
  }, [pages]);

  // Scroll AI chat to bottom on new messages
  useEffect(() => {
    if (aiChatRef.current) {
      aiChatRef.current.scrollTop = aiChatRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const activeFile = pages?.find((p) => p.id === activeFileId) || pages?.[0];

  const handleSave = () => {
    if (!activeFile) return;
    updatePage.mutate(
      { id, pageId: activeFile.id, data: { content: editedContent, title: activeFile.title } },
      {
        onSuccess: () => {
          toast({ title: "Saved" });
          queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
          const merged = (pages || []).map((p) =>
            p.id === activeFile.id ? { ...p, content: editedContent } : p
          );
          setPreviewDoc(buildPreview(merged as FileItem[]));
          setPreviewKey((k) => k + 1);
        },
      }
    );
  };

  const handleRun = () => {
    const merged = (pages || []).map((p) =>
      p.id === activeFileId ? { ...p, content: editedContent } : p
    );
    setPreviewDoc(buildPreview(merged as FileItem[]));
    setPreviewKey((k) => k + 1);
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    let slug = newFileName.trim();
    if (!slug.includes(".")) slug += ".html";
    createPage.mutate(
      { id, data: { title: slug, slug, content: `<!-- ${slug} -->\n` } },
      {
        onSuccess: (f) => {
          queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
          setActiveFileId(f.id);
          setEditedContent(f.content);
          setNewFileName("");
          setAddingFile(false);
          toast({ title: `Created ${slug}` });
        },
      }
    );
  };

  const handleDeleteFile = (fileId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this file?")) return;
    deletePage.mutate(
      { id, pageId: fileId },
      {
        onSuccess: () => {
          if (activeFileId === fileId) { setActiveFileId(null); setEditedContent(""); }
          queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
          toast({ title: "File deleted" });
        },
      }
    );
  };

  const handleLaunch = async () => {
    if (!launchDomain.trim()) return;
    const domain = launchDomain.replace(/^https?:\/\//i, "").trim();
    await new Promise<void>((r) => updateSite.mutate({ id, data: { domain } }, { onSuccess: () => r(), onError: () => r() }));
    launchSite.mutate(
      { id },
      {
        onSuccess: () => {
          setLaunchOpen(false);
          toast({ title: "Site launched!", description: `${domain} is now live.` });
          queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(id) });
        },
      }
    );
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied" });
  };

  // ── AI GENERATION ──────────────────────────────────────────────────────
  const handleAiGenerate = async () => {
    if (!aiInput.trim() || aiGenerating) return;
    const prompt = aiInput.trim();
    setAiInput("");
    setAiMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setAiGenerating(true);

    // Collect current files for "improve" mode
    const existingFiles =
      aiMode === "improve" && pages
        ? pages.map((p) => ({
            name: p.slug,
            content: p.id === activeFileId ? editedContent : p.content,
          }))
        : [];

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`${import.meta.env.BASE_URL}api/admin/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: prompt, existingFiles }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let thinkingMsg = "⏳ Generating your website…";
      setAiMessages((prev) => [...prev, { role: "assistant", content: thinkingMsg }]);

      let dotCount = 0;
      const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        const dots = ".".repeat(dotCount + 1);
        setAiMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: `⏳ Writing code${dots}` };
          return copy;
        });
      }, 500);

      let done = false;
      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "done") {
              clearInterval(dotInterval);
              done = true;
              await applyGeneratedFiles(data.files);
            } else if (data.type === "error") {
              clearInterval(dotInterval);
              done = true;
              setAiMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: `❌ ${data.message}` };
                return copy;
              });
            }
          } catch (_) {}
        }
      }
    } catch (err: any) {
      setAiMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: `❌ Generation failed: ${err.message}` };
        return copy;
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const applyGeneratedFiles = async (files: { html: string; css: string; js: string }) => {
    const currentPages = pages || [];
    const fileMap: Record<string, string> = {
      "index.html": files.html,
      "style.css": files.css,
      "script.js": files.js,
    };

    const updates: Promise<void>[] = [];

    for (const [slug, content] of Object.entries(fileMap)) {
      const existing = currentPages.find((p) => p.slug === slug);
      if (existing) {
        updates.push(
          new Promise<void>((resolve) => {
            updatePage.mutate(
              { id, pageId: existing.id, data: { content, title: existing.title } },
              { onSuccess: () => resolve(), onError: () => resolve() }
            );
          })
        );
      } else {
        updates.push(
          new Promise<void>((resolve) => {
            createPage.mutate(
              { id, data: { title: slug, slug, content } },
              { onSuccess: () => resolve(), onError: () => resolve() }
            );
          })
        );
      }
    }

    await Promise.all(updates);
    await queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });

    // Switch to index.html in editor
    const htmlPage = currentPages.find((p) => p.slug === "index.html");
    if (htmlPage) {
      setActiveFileId(htmlPage.id);
      setEditedContent(files.html);
    }

    // Build preview with new content
    const merged = currentPages.map((p) => {
      if (p.slug === "index.html") return { ...p, content: files.html };
      if (p.slug === "style.css") return { ...p, content: files.css };
      if (p.slug === "script.js") return { ...p, content: files.js };
      return p;
    });
    setPreviewDoc(buildPreview(merged as FileItem[]));
    setPreviewKey((k) => k + 1);

    // Switch to preview so they see the result
    setRightPanel("preview");

    setAiMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = {
        role: "assistant",
        content: "✅ Done! Your website has been built and loaded into the editor. Click **Preview** to see it, or keep chatting to refine it further.",
      };
      return copy;
    });

    toast({ title: "✨ Website generated!", description: "Check the preview panel." });
  };

  const hasUnsavedChanges = activeFile && editedContent !== activeFile.content;

  return (
    <div className="h-screen w-full flex flex-col bg-[#1e1e1e] text-white overflow-hidden select-none" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div className="h-12 bg-[#161616] border-b border-white/8 flex items-center px-3 gap-3 shrink-0 z-10">
        <Link href="/admin/sites">
          <button className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 rounded transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-white/40 font-mono">{site?.clientName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-white/20" />
          <span className="text-white font-semibold">{site?.projectName || "Loading…"}</span>
        </div>

        {site?.status && (
          <span className={`px-2 py-0.5 text-[10px] font-mono tracking-wider ${
            site.status === "live" ? "bg-emerald-500/20 text-emerald-400" :
            site.status === "building" ? "bg-blue-500/20 text-blue-400" :
            "bg-white/8 text-white/40"
          }`}>
            {site.status.toUpperCase()}
          </span>
        )}

        <div className="flex-1" />

        {/* AI Button */}
        <button
          onClick={() => setRightPanel(rightPanel === "ai" ? "preview" : "ai")}
          className={`flex items-center gap-1.5 px-3 h-7 text-xs font-mono rounded transition-all ${
            rightPanel === "ai"
              ? "bg-violet-500/30 text-violet-300 border border-violet-500/40"
              : "bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          AI Builder
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 rounded transition-colors"
          title="Site settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          onClick={handleRun}
          className="flex items-center gap-1.5 px-3 h-7 bg-white/10 hover:bg-white/15 text-white text-xs font-mono rounded transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>

        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            disabled={updatePage.isPending}
            className="flex items-center gap-1.5 px-3 h-7 bg-amber-500/90 hover:bg-amber-500 text-black text-xs font-mono rounded font-bold transition-colors"
          >
            {updatePage.isPending ? "Saving…" : "Save"}
          </button>
        )}

        {site?.status !== "live" ? (
          <button
            onClick={() => { setLaunchDomain(site?.domain || ""); setLaunchOpen(true); }}
            className="flex items-center gap-1.5 px-4 h-7 bg-primary text-[#0a0a10] text-xs font-mono font-bold rounded transition-colors hover:bg-primary/90"
          >
            <Play className="w-3 h-3 fill-current" /> Launch
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 h-7 bg-emerald-500/20 text-emerald-400 text-xs font-mono rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Live
          </div>
        )}
      </div>

      {/* ── FILE TABS ── */}
      <div className="h-9 bg-[#252526] border-b border-white/8 flex items-end overflow-x-auto shrink-0">
        {pages?.map((file) => {
          const active = file.id === activeFileId;
          return (
            <button
              key={file.id}
              onClick={() => switchFile(file as FileItem)}
              className={`flex items-center gap-2 px-4 h-full text-xs font-mono transition-colors shrink-0 border-r border-white/5 ${
                active ? "bg-[#1e1e1e] text-white border-t border-t-primary" : "text-white/40 hover:text-white/70 hover:bg-white/4"
              }`}
            >
              <span>{getFileIcon(file.slug)}</span>
              {file.slug}
              {active && hasUnsavedChanges && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>
          );
        })}
        <button
          onClick={() => setAddingFile(true)}
          className="flex items-center gap-1 px-3 h-full text-white/30 hover:text-white/60 hover:bg-white/4 text-xs transition-colors shrink-0"
          title="New file"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* File Explorer Sidebar */}
        <div className="w-52 bg-[#252526] border-r border-white/8 flex flex-col shrink-0 overflow-hidden">
          <div className="px-3 py-2 text-[10px] font-mono text-white/30 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
            <span>Explorer</span>
            <button onClick={() => setAddingFile(true)} className="hover:text-white/60 transition-colors"><Plus className="w-3 h-3" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {pagesLoading ? (
              <div className="px-4 py-3 text-xs text-white/30 font-mono">Loading…</div>
            ) : (
              pages?.map((file) => {
                const active = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    onClick={() => switchFile(file as FileItem)}
                    className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors ${active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}
                  >
                    <div className="flex items-center gap-2 text-xs font-mono truncate">
                      <span className="shrink-0">{getFileIcon(file.slug)}</span>
                      <span className="truncate">{file.slug}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteFile(file.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all shrink-0 ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
            {addingFile && (
              <div className="px-3 py-2 border-t border-white/5 mt-1">
                <Input
                  autoFocus
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddFile(); if (e.key === "Escape") setAddingFile(false); }}
                  placeholder="filename.html"
                  className="h-6 text-xs font-mono bg-white/10 border-white/20 rounded-none px-2 text-white placeholder:text-white/30"
                />
                <div className="flex gap-1 mt-1.5">
                  <button onClick={handleAddFile} className="text-[10px] font-mono text-primary hover:text-primary/80">Create</button>
                  <button onClick={() => { setAddingFile(false); setNewFileName(""); }} className="text-[10px] font-mono text-white/30 hover:text-white/60 ml-2">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <Editor
              height="100%"
              language={getLang(activeFile.slug)}
              value={editedContent}
              onChange={(val) => setEditedContent(val || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                tabSize: 2,
                wordWrap: "off",
                scrollBeyondLastLine: false,
                renderLineHighlight: "all",
                automaticLayout: true,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace",
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                bracketPairColorization: { enabled: true },
              }}
              onMount={(editor) => {
                editor.addAction({
                  id: "save-file",
                  label: "Save File",
                  keybindings: [2097 /* Ctrl+S */],
                  run: () => handleSave(),
                });
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20 flex-col gap-3">
              <FileCode className="w-12 h-12" />
              <p className="text-sm font-mono">Select a file to edit</p>
            </div>
          )}
        </div>

        {/* Right Panel: Preview OR AI Chat */}
        <div className="w-[42%] flex flex-col border-l border-white/8 shrink-0 overflow-hidden">

          {/* Panel Switcher */}
          <div className="h-8 bg-[#2d2d2d] flex items-center shrink-0 border-b border-white/5">
            <button
              onClick={() => setRightPanel("preview")}
              className={`flex items-center gap-1.5 px-4 h-full text-[11px] font-mono transition-colors border-r border-white/5 ${
                rightPanel === "preview" ? "text-white bg-[#1e1e1e]" : "text-white/40 hover:text-white/70"
              }`}
            >
              <Eye className="w-3 h-3" /> Preview
            </button>
            <button
              onClick={() => setRightPanel("ai")}
              className={`flex items-center gap-1.5 px-4 h-full text-[11px] font-mono transition-colors ${
                rightPanel === "ai" ? "text-violet-300 bg-[#1e1e1e]" : "text-white/40 hover:text-violet-300/70"
              }`}
            >
              <Sparkles className="w-3 h-3" /> AI Builder
            </button>
            <div className="flex-1" />
            {rightPanel === "preview" && (
              <button onClick={handleRun} className="px-3 text-white/30 hover:text-white/60 transition-colors" title="Refresh">
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Preview iframe */}
          {rightPanel === "preview" && (
            <iframe
              ref={iframeRef}
              key={previewKey}
              srcDoc={previewDoc}
              sandbox="allow-scripts"
              className="flex-1 w-full border-none bg-white"
              title="Site preview"
            />
          )}

          {/* AI Chat Panel */}
          {rightPanel === "ai" && (
            <div className="flex-1 flex flex-col bg-[#1a1a2e] overflow-hidden">
              {/* Mode toggle */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mr-1">Mode:</span>
                <button
                  onClick={() => setAiMode("fresh")}
                  className={`px-3 py-1 text-[11px] font-mono rounded transition-colors ${
                    aiMode === "fresh" ? "bg-violet-500/30 text-violet-300 border border-violet-500/40" : "text-white/40 hover:text-white/70 border border-white/10"
                  }`}
                >
                  ✨ Build Fresh
                </button>
                <button
                  onClick={() => setAiMode("improve")}
                  className={`px-3 py-1 text-[11px] font-mono rounded transition-colors ${
                    aiMode === "improve" ? "bg-blue-500/30 text-blue-300 border border-blue-500/40" : "text-white/40 hover:text-white/70 border border-white/10"
                  }`}
                >
                  🔧 Improve Current
                </button>
              </div>

              {/* Chat history */}
              <div ref={aiChatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role !== "user" && (
                      <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-violet-500/20 text-violet-100 border border-violet-500/20"
                        : msg.role === "system"
                        ? "bg-white/4 text-white/60 text-xs border border-white/5"
                        : "bg-[#252540] text-white/90 border border-white/8"
                    }`}>
                      {msg.content.split("**").map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                      )}
                      {msg.role === "assistant" && aiGenerating && i === aiMessages.length - 1 && (
                        <span className="inline-flex items-center gap-1 ml-2">
                          <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/8 bg-[#161622]">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAiGenerate();
                      }
                    }}
                    placeholder={aiMode === "fresh"
                      ? "Describe your website… e.g. 'A dark barbershop site with booking, gallery, and neon accents'"
                      : "Describe what to improve… e.g. 'Add a contact form' or 'Make the colors more vibrant'"
                    }
                    rows={3}
                    disabled={aiGenerating}
                    className="flex-1 bg-[#252540] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-violet-500/50 disabled:opacity-50 font-sans leading-relaxed"
                  />
                  <button
                    onClick={handleAiGenerate}
                    disabled={!aiInput.trim() || aiGenerating}
                    className="w-9 h-9 flex items-center justify-center bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shrink-0"
                  >
                    {aiGenerating
                      ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                      : <Send className="w-4 h-4 text-white" />
                    }
                  </button>
                </div>
                <p className="text-[10px] text-white/20 mt-1.5 font-mono">Enter to send · Shift+Enter for new line</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div className="h-6 bg-[#007acc] flex items-center px-4 gap-4 text-[11px] text-white/80 shrink-0">
        <span className="font-mono">{activeFile ? getLang(activeFile.slug).toUpperCase() : ""}</span>
        <span className="flex-1" />
        <span className="font-mono">
          {pages?.length ?? 0} file{(pages?.length ?? 0) !== 1 ? "s" : ""}
        </span>
        {hasUnsavedChanges && <span className="text-amber-300 font-mono">● Unsaved changes</span>}
        <span className="font-mono">Ctrl+S to save</span>
      </div>

      {/* ── LAUNCH DIALOG ── */}
      <Dialog open={launchOpen} onOpenChange={setLaunchOpen}>
        <DialogContent className="sm:max-w-md bg-[#252526] border-white/10 rounded-none text-white">
          <DialogHeader>
            <DialogTitle className="font-mono text-base flex items-center gap-2">
              <Play className="w-4 h-4 text-primary fill-current" /> Launch Site
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <p className="text-sm text-white/50">Enter the domain you've pointed to this server. We'll save it and mark the site live.</p>
            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 block">Domain *</label>
              <Input value={launchDomain} onChange={e => setLaunchDomain(e.target.value)} placeholder="www.example.com"
                className="bg-[#1e1e1e] border-white/10 rounded-none font-mono text-white h-10" />
            </div>
            {launchDomain.trim() && (
              <div className="border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono mb-3"><AlertTriangle className="w-3.5 h-3.5" /> DNS REQUIRED AFTER LAUNCH</div>
                {[
                  { type: "A", name: "@", value: "76.76.21.21" },
                  { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-white/30 w-12">{r.type}</span>
                    <span className="text-white/50 w-10">{r.name}</span>
                    <span className="text-primary flex-1">{r.value}</span>
                    <button onClick={() => copyText(r.value)} className="text-white/30 hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setLaunchOpen(false)} className="flex-1 border-white/10 text-white rounded-none font-mono text-xs">Cancel</Button>
              <Button onClick={handleLaunch} disabled={!launchDomain.trim() || launchSite.isPending} className="flex-1 bg-primary text-[#0a0a10] hover:bg-primary/90 rounded-none font-mono text-xs font-bold">
                {launchSite.isPending ? "Launching…" : "Confirm Launch"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── SETTINGS DIALOG ── */}
      {site && (
        <SiteSettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} site={site} updateSite={updateSite} queryClient={queryClient} />
      )}
    </div>
  );
}

function SiteSettingsDialog({ open, onClose, site, updateSite, queryClient }: any) {
  const [domain, setDomain] = useState(site.domain || "");
  const [clientEmail, setClientEmail] = useState(site.clientEmail || "");
  const [status, setStatus] = useState(site.status);
  const { toast } = useToast();

  const handleSave = () => {
    updateSite.mutate({ id: site.id, data: { domain, clientEmail, status } }, {
      onSuccess: () => {
        toast({ title: "Settings saved" });
        queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(site.id) });
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-[#252526] border-white/10 rounded-none text-white">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> Site Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {[
            { label: "Domain", value: domain, set: setDomain, placeholder: "www.example.com" },
            { label: "Client Email", value: clientEmail, set: setClientEmail, placeholder: "client@company.com" },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5 block">{label}</label>
              <Input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} className="bg-[#1e1e1e] border-white/10 rounded-none font-mono text-white h-9 text-sm" />
            </div>
          ))}
          <div>
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5 block">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/10 text-white text-sm h-9 px-3 font-mono rounded-none focus:outline-none">
              {["draft", "building", "review", "paused", ...(site.status === "live" ? ["live"] : [])].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-white rounded-none font-mono text-xs">Cancel</Button>
            <Button onClick={handleSave} disabled={updateSite.isPending} className="flex-1 bg-primary text-[#0a0a10] hover:bg-primary/90 rounded-none font-mono text-xs font-bold">
              {updateSite.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
