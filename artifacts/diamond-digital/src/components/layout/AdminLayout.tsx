import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Inbox, Globe, LogOut, Menu, X } from "lucide-react";

function getAdminUsername(): string {
  try {
    const token = localStorage.getItem("admin_token");
    if (!token) return "Admin";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username || "Admin";
  } catch {
    return "Admin";
  }
}

function handleSignOut() {
  localStorage.removeItem("admin_token");
  window.location.href = `${import.meta.env.BASE_URL}admin/login`;
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = getAdminUsername();

  const isSiteBuilder = location.startsWith("/admin/sites/") && location !== "/admin/sites";

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Inbox, label: "Quote Requests", href: "/admin/quotes" },
    { icon: Globe, label: "Client Sites", href: "/admin/sites" },
  ];

  if (isSiteBuilder) {
    return <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">{children}</div>;
  }

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex">

      {/* ── Desktop sidebar ── */}
      <div className="hidden md:flex w-64 border-r border-border bg-card flex-col h-[100dvh] sticky top-0 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2 group">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Software Diamond" className="w-6 h-6" />
            <span className="font-display font-bold text-sm tracking-widest text-white">
              SOFTWARE<span className="text-primary">DIAMOND</span>
            </span>
          </Link>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-1">
          <div className="text-xs font-mono text-muted-foreground mb-2 mt-4 px-2 tracking-widest">WORKSPACE</div>
          <NavLinks />
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-sm font-medium truncate">{username}</div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-card border-b border-border flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center text-white rounded-md hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Software Diamond" className="w-5 h-5" />
          <span className="font-display font-bold text-sm tracking-widest text-white">
            SOFTWARE<span className="text-primary">DIAMOND</span>
          </span>
        </Link>
        <div className="flex-1" />
        <button onClick={handleSignOut} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Sign out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-card border-r border-border flex flex-col h-full z-10">
            <div className="h-14 flex items-center px-4 border-b border-border justify-between">
              <Link href="/admin" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="w-5 h-5" />
                <span className="font-display font-bold text-sm tracking-widest text-white">
                  SOFTWARE<span className="text-primary">DIAMOND</span>
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-muted-foreground hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-1">
              <div className="text-xs font-mono text-muted-foreground mb-2 mt-2 px-2 tracking-widest">WORKSPACE</div>
              <NavLinks onClick={() => setMobileOpen(false)} />
            </div>
            <div className="p-4 border-t border-border flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <div className="text-sm font-medium truncate">{username}</div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <main className="flex-1 p-4 pt-[calc(3.5rem+1rem)] md:pt-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
