import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, User } from "lucide-react";
import { useState } from "react";

function isAdminLoggedIn() {
  try {
    const token = localStorage.getItem("admin_token");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch { return false; }
}

export function PublicNavbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const adminLoggedIn = isAdminLoggedIn();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/industries", label: "Industries" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/5">
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="The Diamond Digital Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="font-display font-bold text-base sm:text-xl tracking-wider text-white">
            SOFTWARE<span className="text-primary">DIAMOND</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm tracking-wide transition-colors hover:text-primary ${location === link.href ? "text-primary glow-text" : "text-muted-foreground"}`}>
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/client-login" className="ml-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5 font-mono text-xs tracking-widest gap-1.5 rounded-none border border-white/10 h-9 px-3 lg:px-4">
              <User className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">CLIENT PORTAL</span>
              <span className="lg:hidden">PORTAL</span>
            </Button>
          </Link>
          <Link href={adminLoggedIn ? "/admin" : "/admin/login"}>
            <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs tracking-widest gap-1.5 h-9 rounded-none px-3 lg:px-4">
              <Shield className="w-3.5 h-3.5" />
              {adminLoggedIn ? "CONSOLE" : "ADMIN"}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-md hover:bg-white/5 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-panel border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                  <span className={`flex items-center py-3 px-3 text-base tracking-wide rounded-md transition-colors ${location === link.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2.5">
                <Link href="/client-login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white font-mono text-sm gap-2 rounded-none h-11">
                    <User className="w-4 h-4" /> CLIENT PORTAL
                  </Button>
                </Link>
                <Link href={adminLoggedIn ? "/admin" : "/admin/login"} onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground font-mono text-sm gap-2 rounded-none h-11">
                    <Shield className="w-4 h-4" /> {adminLoggedIn ? "ADMIN CONSOLE" : "ADMIN"}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
