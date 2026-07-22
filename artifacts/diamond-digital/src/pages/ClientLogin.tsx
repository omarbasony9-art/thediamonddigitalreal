import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Eye, EyeOff, ArrowLeft } from "lucide-react";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Mode = "login" | "register";

export default function ClientLogin() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/client/login" : "/api/client/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, company: form.company };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ variant: "destructive", title: "Error", description: data.error || "Something went wrong." });
        return;
      }

      localStorage.setItem("client_token", data.token);
      toast({ title: mode === "login" ? "Welcome back!" : "Account created!", description: "Redirecting to your portal..." });
      setLocation("/client-portal");
    } catch {
      toast({ variant: "destructive", title: "Network error", description: "Could not reach the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Back link */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-mono">
        <ArrowLeft className="w-4 h-4" /> HOME
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-black text-white mb-2">CLIENT PORTAL</h1>
          <p className="text-muted-foreground text-sm">
            {mode === "login" ? "Sign in to track your project status." : "Create an account to access your project dashboard."}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-8 border border-white/10">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-colors ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"}`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 text-xs font-mono tracking-widest transition-colors ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"}`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Full Name *</label>
                <Input
                  required
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="bg-card border-white/10 rounded-none focus-visible:ring-primary h-12 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Company</label>
                <Input
                  placeholder="Acme Corp"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })}
                  className="bg-card border-white/10 rounded-none focus-visible:ring-primary h-12 text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Email Address *</label>
            <Input
              required
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="bg-card border-white/10 rounded-none focus-visible:ring-primary h-12 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase mb-2 block">Password *</label>
            <div className="relative">
              <Input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                minLength={8}
                className="bg-card border-white/10 rounded-none focus-visible:ring-primary h-12 text-white pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === "register" && (
              <p className="text-xs text-muted-foreground mt-1.5">Minimum 8 characters</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-sm tracking-widest mt-2"
          >
            {loading ? "PLEASE WAIT..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Your portal shows the live status of your website project.{" "}
          <Link href="/#quote">
            <span className="text-primary hover:underline cursor-pointer">Request a project</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
