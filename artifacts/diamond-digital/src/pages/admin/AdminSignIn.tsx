import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSignIn() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("admin_token", data.token);
      setLocation("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, #1a1a2e 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-6 border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white tracking-widest">ADMIN CONSOLE</h1>
          <p className="text-muted-foreground text-sm mt-2 font-mono">DiamondDigital · Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block tracking-widest">Username</label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
              className="bg-card border-white/10 rounded-none h-12 text-white font-mono focus-visible:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block tracking-widest">Password</label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="bg-card border-white/10 rounded-none h-12 text-white font-mono focus-visible:ring-primary pr-11"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-destructive font-mono border border-destructive/20 bg-destructive/5 px-4 py-3">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-sm tracking-widest mt-2">
            {loading ? "VERIFYING..." : "SIGN IN"}
          </Button>
        </form>
      </div>
    </div>
  );
}
