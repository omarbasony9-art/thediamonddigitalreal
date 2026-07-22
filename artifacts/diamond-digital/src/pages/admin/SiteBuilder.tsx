import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import {
  useGetSite,
  useUpdateSite,
  useLaunchSite,
  useListSitePages,
  useCreateSitePage,
  useUpdateSitePage,
  useDeleteSitePage,
  getGetSiteQueryKey,
  getListSitePagesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Play, Layout, Settings, FileCode, CheckCircle2, Globe, File, Plus, Trash2, Save, ExternalLink, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function SiteBuilder() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"pages" | "settings">("pages");
  const [activePageId, setActivePageId] = useState<number | null>(null);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [launchDomain, setLaunchDomain] = useState("");
  const [launchedDomain, setLaunchedDomain] = useState<string | null>(null);

  const { data: site, isLoading: siteLoading, isError: siteError } = useGetSite(id, { query: { enabled: !!id, queryKey: getGetSiteQueryKey(id) } });
  const { data: pages, isLoading: pagesLoading } = useListSitePages(id, { query: { enabled: !!id, queryKey: getListSitePagesQueryKey(id) } });

  const updateSite = useUpdateSite();
  const launchSite = useLaunchSite();
  const createPage = useCreateSitePage();
  const updatePage = useUpdateSitePage();
  const deletePage = useDeleteSitePage();

  // Pre-fill domain from site settings
  useEffect(() => {
    if (site?.domain) setLaunchDomain(site.domain);
  }, [site?.domain]);

  const handleOpenLaunchDialog = () => {
    if (site?.status === "live") return;
    setLaunchDialogOpen(true);
  };

  const handleConfirmLaunch = async () => {
    if (!launchDomain.trim()) {
      toast({ variant: "destructive", title: "Domain required", description: "Enter a domain name to launch the site." });
      return;
    }
    const domain = launchDomain.trim().replace(/^https?:\/\//i, "");

    // Save domain first, then launch
    await new Promise<void>((resolve) => {
      updateSite.mutate({ id, data: { domain } }, { onSuccess: () => resolve(), onError: () => resolve() });
    });

    launchSite.mutate({ id }, {
      onSuccess: () => {
        setLaunchedDomain(domain);
        setLaunchDialogOpen(false);
        toast({ title: "Site launched!", description: `${domain} is now live.` });
        queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(id) });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Launch failed", description: "Please try again." });
      }
    });
  };

  const handleCreatePage = () => {
    const title = prompt("Page title:");
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    createPage.mutate({ id, data: { title, slug, content: `# ${title}\n\nAdd your page content here.` } }, {
      onSuccess: (newPage) => {
        queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
        setActivePageId(newPage.id);
        toast({ title: "Page created" });
      }
    });
  };

  const handleDeletePage = (pageId: number) => {
    if (!confirm("Delete this page?")) return;
    deletePage.mutate({ id, pageId }, {
      onSuccess: () => {
        if (activePageId === pageId) setActivePageId(null);
        queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(id) });
        toast({ title: "Page deleted" });
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  if (siteError) return <div className="p-8 text-center text-destructive">Error loading site.</div>;
  if (siteLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">LOADING BUILDER...</div>;

  const activePage = pages?.find(p => p.id === activePageId) || pages?.[0];

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">

      {/* ── TOP BAR ── */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/sites">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white rounded-none">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="font-bold text-white text-sm">{site?.projectName}</span>
            <span className="text-muted-foreground text-xs mx-1">/</span>
            <span className="text-muted-foreground text-sm">{site?.clientName}</span>
          </div>
          <div className={`px-2 py-0.5 text-[10px] font-mono tracking-wider ml-2 ${
            site?.status === "live" ? "bg-primary/20 text-primary border border-primary/30" :
            site?.status === "building" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
            site?.status === "review" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
            "bg-white/5 text-muted-foreground border border-white/10"
          }`}>
            {site?.status?.toUpperCase()}
          </div>
          {site?.domain && (
            <a href={`https://${site.domain}`} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-mono">
              <ExternalLink className="w-3 h-3" />
              {site.domain}
            </a>
          )}
        </div>

        <div className="flex items-center gap-3">
          {site?.previewUrl && (
            <Button variant="outline" size="sm" className="h-8 rounded-none border-border font-mono text-xs text-muted-foreground hover:text-white" asChild>
              <a href={site.previewUrl} target="_blank" rel="noreferrer">PREVIEW</a>
            </Button>
          )}
          {site?.status !== "live" ? (
            <Button
              onClick={handleOpenLaunchDialog}
              className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-xs px-6 gap-2"
            >
              <Play className="w-3 h-3 fill-current" /> LAUNCH SITE
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-primary font-mono text-xs px-4 border border-primary/30 h-8 bg-primary/10">
              <CheckCircle2 className="w-3 h-3" /> LIVE
            </div>
          )}
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-64 border-r border-border bg-[#0a0a10] flex flex-col shrink-0">
          <div className="flex border-b border-border">
            {(["pages", "settings"] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-xs font-mono tracking-wider border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "pages" ? <Layout className="w-4 h-4 mx-auto mb-1" /> : <Settings className="w-4 h-4 mx-auto mb-1" />}
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "pages" && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-2 mb-2 text-xs font-mono text-muted-foreground uppercase">
                  <span>File Tree</span>
                  <button onClick={handleCreatePage} className="hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                {pagesLoading ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">Loading...</div>
                ) : pages?.map(page => (
                  <div key={page.id} className="group flex items-center justify-between pr-2">
                    <button
                      onClick={() => setActivePageId(page.id)}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 text-sm text-left truncate rounded-sm transition-colors ${activePageId === page.id || (!activePageId && activePage?.id === page.id) ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
                    >
                      <FileCode className="w-4 h-4 shrink-0" />
                      <span className="truncate">{page.slug}.tsx</span>
                    </button>
                    <button onClick={() => handleDeletePage(page.id)} className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {!pagesLoading && (!pages || pages.length === 0) && (
                  <div className="px-4 py-6 text-center">
                    <File className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs text-muted-foreground mb-3">No pages yet</p>
                    <button onClick={handleCreatePage} className="text-xs text-primary hover:text-primary/80 font-mono">+ Add page</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && site && (
              <SiteSettingsPanel site={site} updateSite={updateSite} queryClient={queryClient} />
            )}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 bg-[#1e1e24] flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 opacity-40 z-0" style={{backgroundImage: "radial-gradient(circle, #2a2a35 1px, transparent 1px)", backgroundSize: "20px 20px"}} />

          {activeTab === "pages" ? (
            activePage ? (
              <PageEditor page={activePage} siteId={id} updatePage={updatePage} queryClient={queryClient} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground relative z-10 flex-col gap-4">
                <File className="w-16 h-16 opacity-20" />
                <p className="font-mono text-sm">Select or create a page to start editing</p>
                <Button variant="outline" onClick={handleCreatePage} className="border-border text-white rounded-none">Add First Page</Button>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground relative z-10 flex-col gap-4">
              <Settings className="w-16 h-16 opacity-20" />
              <p className="font-mono text-sm">Site settings in sidebar</p>
            </div>
          )}
        </div>
      </div>

      {/* ── LAUNCH DIALOG ── */}
      <Dialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border rounded-none text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-3">
              <Play className="w-5 h-5 text-primary fill-current" />
              LAUNCH SITE
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Launching marks the site as live. All you need is a domain pointed to your hosting. Enter the domain below — we'll save it and flip the site to live status.
            </p>

            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Domain Name *</label>
              <Input
                placeholder="www.clientwebsite.com"
                value={launchDomain}
                onChange={e => setLaunchDomain(e.target.value)}
                className="bg-background border-white/10 rounded-none focus-visible:ring-primary h-11 text-white font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1.5">No https:// needed. Example: example.com or www.example.com</p>
            </div>

            {launchDomain.trim() && (
              <div className="border border-white/10 bg-background/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  AFTER LAUNCH: DNS CONFIGURATION REQUIRED
                </div>
                <p className="text-xs text-muted-foreground mb-3">Point your domain to this server by adding one of the following DNS records with your domain registrar:</p>
                {[
                  { type: "A Record", name: launchDomain.replace(/^www\./i, "") || "@", value: "76.76.21.21" },
                  { type: "CNAME", name: launchDomain.startsWith("www.") ? launchDomain : `www.${launchDomain}`, value: "cname.vercel-dns.com" },
                ].map((rec, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-2 border-t border-white/5 text-xs font-mono">
                    <span className="text-muted-foreground/60 w-16">{rec.type}</span>
                    <span className="text-white/70 truncate flex-1">{rec.name}</span>
                    <span className="text-primary">{rec.value}</span>
                    <button onClick={() => copyToClipboard(rec.value)} className="text-muted-foreground hover:text-white transition-colors shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground/60 mt-2">DNS changes propagate within 24–48 hours.</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setLaunchDialogOpen(false)} className="flex-1 border-white/20 text-white rounded-none font-mono text-xs">
                CANCEL
              </Button>
              <Button
                onClick={handleConfirmLaunch}
                disabled={launchSite.isPending || !launchDomain.trim()}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-xs gap-2"
              >
                <Play className="w-3 h-3 fill-current" />
                {launchSite.isPending ? "LAUNCHING..." : "CONFIRM LAUNCH"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── POST-LAUNCH DNS CARD ── */}
      {launchedDomain && (
        <div className="absolute bottom-6 right-6 max-w-sm bg-card border border-primary/30 p-5 shadow-xl z-50">
          <div className="flex items-center gap-2 text-primary font-mono text-xs mb-3">
            <CheckCircle2 className="w-4 h-4" /> SITE IS LIVE
          </div>
          <p className="text-white text-sm font-bold mb-1">{site?.projectName}</p>
          <p className="text-muted-foreground text-xs mb-4 font-mono">{launchedDomain}</p>
          <p className="text-xs text-muted-foreground mb-3">Point your domain registrar DNS to complete setup:</p>
          <div className="text-xs font-mono space-y-1">
            <div className="flex justify-between gap-4 text-muted-foreground">
              <span>A record →</span><span className="text-primary">76.76.21.21</span>
            </div>
            <div className="flex justify-between gap-4 text-muted-foreground">
              <span>CNAME →</span><span className="text-primary">cname.vercel-dns.com</span>
            </div>
          </div>
          <button onClick={() => setLaunchedDomain(null)} className="text-xs text-muted-foreground hover:text-white mt-4 font-mono transition-colors">DISMISS</button>
        </div>
      )}
    </div>
  );
}

function PageEditor({ page, siteId, updatePage, queryClient }: any) {
  const [content, setContent] = useState(page.content);
  const [title, setTitle] = useState(page.title);
  const { toast } = useToast();

  useEffect(() => {
    setContent(page.content);
    setTitle(page.title);
  }, [page.id]);

  const handleSave = () => {
    updatePage.mutate({ id: siteId, pageId: page.id, data: { content, title } }, {
      onSuccess: () => {
        toast({ title: "Saved" });
        queryClient.invalidateQueries({ queryKey: getListSitePagesQueryKey(siteId) });
      }
    });
  };

  const hasChanges = content !== page.content || title !== page.title;

  return (
    <div className="flex-1 flex flex-col relative z-10">
      <div className="h-10 bg-[#18181f] border-b border-border flex items-center px-4 justify-between">
        <div className="flex items-center gap-3 flex-1">
          <FileCode className="w-4 h-4 text-primary shrink-0" />
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="h-7 bg-transparent border-transparent hover:border-border focus:border-primary text-sm font-mono rounded-none w-52 px-2"
          />
          {hasChanges && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />}
        </div>
        <Button onClick={handleSave} disabled={updatePage.isPending || !hasChanges} size="sm" className="h-7 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-xs gap-1.5 disabled:opacity-30">
          <Save className="w-3 h-3" /> SAVE
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 bg-[#0a0a10] border-border text-[#d4d4d4] font-mono text-sm p-6 resize-none rounded-none focus-visible:ring-1 focus-visible:ring-primary/50"
          spellCheck={false}
          placeholder="Write page content, HTML, or notes here..."
        />
      </div>
    </div>
  );
}

function SiteSettingsPanel({ site, updateSite, queryClient }: any) {
  const [data, setData] = useState({
    projectName: site.projectName,
    clientName: site.clientName,
    domain: site.domain || "",
    clientEmail: site.clientEmail || "",
    description: site.description || "",
    status: site.status,
  });
  const { toast } = useToast();

  const handleSave = () => {
    updateSite.mutate({ id: site.id, data }, {
      onSuccess: () => {
        toast({ title: "Settings saved" });
        queryClient.invalidateQueries({ queryKey: getGetSiteQueryKey(site.id) });
      }
    });
  };

  return (
    <div className="p-4 space-y-5">
      <div className="space-y-4">
        {[
          { label: "Project Name", key: "projectName", placeholder: "My Client Site" },
          { label: "Client Name", key: "clientName", placeholder: "Client Company Inc." },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">{label}</label>
            <Input value={(data as any)[key]} onChange={e => setData({ ...data, [key]: e.target.value })} placeholder={placeholder} className="bg-background border-border rounded-none h-9 text-sm" />
          </div>
        ))}

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Domain</label>
          <Input value={data.domain} onChange={e => setData({ ...data, domain: e.target.value })} placeholder="www.example.com" className="bg-background border-border rounded-none h-9 text-sm font-mono" />
          <p className="text-[10px] text-muted-foreground/60 mt-1">Used when launching the site</p>
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Client Email</label>
          <Input value={data.clientEmail} onChange={e => setData({ ...data, clientEmail: e.target.value })} placeholder="client@company.com" className="bg-background border-border rounded-none h-9 text-sm" />
          <p className="text-[10px] text-muted-foreground/60 mt-1">Links this site to the client's portal account</p>
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Status</label>
          <select
            value={data.status}
            onChange={e => setData({ ...data, status: e.target.value })}
            className="w-full bg-background border border-border text-white text-sm h-9 px-3 rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="building">Building</option>
            <option value="review">Review</option>
            <option value="paused">Paused</option>
            {site.status === "live" && <option value="live">Live</option>}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Description</label>
          <Textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} className="bg-background border-border rounded-none text-sm resize-y min-h-[80px]" />
        </div>
      </div>

      <Button onClick={handleSave} disabled={updateSite.isPending} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-none font-mono text-xs h-9">
        {updateSite.isPending ? "SAVING..." : "SAVE SETTINGS"}
      </Button>

      <div className="pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground font-mono mb-2">METADATA</div>
        <div className="text-xs text-muted-foreground space-y-2">
          {[
            { label: "Site ID", value: site.id },
            { label: "Stack", value: site.tech },
            { label: "Quote ID", value: site.quoteId || "N/A" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span>{label}</span><span className="text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
