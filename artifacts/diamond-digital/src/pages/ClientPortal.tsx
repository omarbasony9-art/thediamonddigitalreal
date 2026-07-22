import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Globe, Clock, CheckCircle2, AlertCircle, Hammer, Eye, PauseCircle, User } from "lucide-react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type ClientMe = {
  id: number;
  name: string;
  email: string;
  company?: string;
  sites: SiteStatus[];
};

type SiteStatus = {
  id: number;
  projectName: string;
  clientName: string;
  status: string;
  tech: string;
  domain?: string;
  liveUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  launchedAt?: string;
};

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; desc: string }> = {
  draft: { label: "Planning", icon: Clock, color: "text-muted-foreground", desc: "Your project is in the initial planning phase." },
  building: { label: "In Development", icon: Hammer, color: "text-blue-400", desc: "Our team is actively building your project." },
  review: { label: "In Review", icon: Eye, color: "text-amber-400", desc: "Your project is undergoing quality review and testing." },
  live: { label: "Live", icon: CheckCircle2, color: "text-primary", desc: "Your website is live and accessible to the world." },
  paused: { label: "Paused", icon: PauseCircle, color: "text-orange-400", desc: "Work is temporarily paused. We'll be in touch soon." },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${cfg.color}`}>
      <cfg.icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ status }: { status: string }) {
  const steps = ["draft", "building", "review", "live"];
  const idx = steps.indexOf(status);
  const pct = status === "live" ? 100 : idx < 0 ? 0 : Math.round(((idx + 1) / steps.length) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>Project Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-blue-400"
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground/60">
        {["Planning", "Building", "Review", "Live"].map((s, i) => (
          <span key={i} className={i <= idx || status === "live" ? "text-primary" : ""}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function ClientPortal() {
  const [me, setMe] = useState<ClientMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("client_token");
    if (!token) { setLocation("/client-login"); return; }

    fetch(`${API_BASE}/api/client/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401) { localStorage.removeItem("client_token"); setLocation("/client-login"); return; }
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setMe(data);
      })
      .catch(() => setError("Could not load your portal. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("client_token");
    toast({ title: "Signed out" });
    setLocation("/client-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-mono text-sm animate-pulse">LOADING PORTAL...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-white font-bold text-xl">{error}</p>
        <Button onClick={() => setLocation("/client-login")} className="rounded-none font-mono">
          BACK TO LOGIN
        </Button>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-white/8 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Diamond Digital" className="w-7 h-7" />
            <span className="font-display font-bold text-base tracking-wider text-white">
              DIAMOND<span className="text-primary">DIGITAL</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{me.name}</span>
              {me.company && <span className="text-muted-foreground/50">· {me.company}</span>}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-white gap-2 rounded-none font-mono text-xs">
              <LogOut className="w-3.5 h-3.5" /> SIGN OUT
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2">
              Welcome back, {me.name.split(" ")[0]}.
            </h1>
            <p className="text-muted-foreground">Here's the current status of your project{me.sites.length !== 1 ? "s" : ""}.</p>
          </div>

          {me.sites.length === 0 ? (
            <div className="border border-white/10 bg-card/30 p-16 text-center">
              <Globe className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-white font-display font-bold text-2xl mb-3">No active projects yet</h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
                Once we start working on your project, it will appear here with live status updates.
              </p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-sm">
                <Link href="/#quote">START A PROJECT</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {me.sites.map((site, i) => {
                const cfg = STATUS_CONFIG[site.status] || STATUS_CONFIG.draft;
                return (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border border-white/10 bg-card/30 p-8 hover:border-white/20 transition-colors"
                  >
                    {/* Site header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-display font-bold text-white mb-1">{site.projectName}</h2>
                        <p className="text-muted-foreground text-sm">{site.clientName}</p>
                      </div>
                      <StatusBadge status={site.status} />
                    </div>

                    {/* Status description */}
                    <div className="p-4 border border-white/5 bg-background/40 mb-6">
                      <p className="text-sm text-muted-foreground">{cfg.desc}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <ProgressBar status={site.status} />
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-xs font-mono text-muted-foreground mb-6">
                      <div className="flex justify-between">
                        <span>Tech Stack</span>
                        <span className="text-white">{site.tech.toUpperCase()}</span>
                      </div>
                      {site.domain && (
                        <div className="flex justify-between">
                          <span>Domain</span>
                          <span className="text-white">{site.domain}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Last Updated</span>
                        <span className="text-white">{new Date(site.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {site.launchedAt && (
                        <div className="flex justify-between">
                          <span>Launched</span>
                          <span className="text-primary">{new Date(site.launchedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      )}
                    </div>

                    {/* Live link */}
                    {site.liveUrl && (
                      <a
                        href={site.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-mono transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        VIEW LIVE SITE
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/8 text-center">
            <p className="text-muted-foreground text-sm mb-4">Have questions about your project?</p>
            <Button asChild variant="outline" className="border-white/20 rounded-none font-mono text-sm gap-2">
              <a href="mailto:contact@thetitanmedia.com">CONTACT YOUR TEAM</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
