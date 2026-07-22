import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X, Shield, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/react";

export function PublicNavbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/industries", label: "Industries" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="DiamondDigital Logo" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-display font-bold text-xl tracking-wider text-white">
            DIAMOND<span className="text-primary">DIGITAL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`text-sm tracking-wide transition-colors hover:text-primary ${location === link.href ? "text-primary glow-text" : "text-muted-foreground"}`}>
                {link.label}
              </span>
            </Link>
          ))}

          {/* CLIENT PORTAL */}
          <Link href="/client-login" className="ml-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white hover:bg-white/5 font-mono text-xs tracking-widest gap-1.5 rounded-none border border-white/10 h-9 px-4">
              <User className="w-3.5 h-3.5" />
              CLIENT PORTAL
            </Button>
          </Link>

          {/* ADMIN */}
          {isSignedIn ? (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs tracking-widest gap-1.5 h-9 rounded-none">
                <Shield className="w-3.5 h-3.5" />
                CONSOLE
              </Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs tracking-widest gap-1.5 h-9 rounded-none">
                <Shield className="w-3.5 h-3.5" />
                ADMIN
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-panel absolute top-20 left-0 w-full border-t border-white/10 p-6 flex flex-col gap-4"
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              <span className={`block py-2 text-lg tracking-wide ${location === link.href ? "text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </span>
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 mt-2 flex flex-col gap-3">
            <Link href="/client-login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full border-white/20 text-white font-mono text-sm gap-2 rounded-none">
                <User className="w-4 h-4" /> CLIENT PORTAL
              </Button>
            </Link>
            {isSignedIn ? (
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground font-mono text-sm gap-2 rounded-none">
                  <Shield className="w-4 h-4" /> ADMIN CONSOLE
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground font-mono text-sm gap-2 rounded-none">
                  <Shield className="w-4 h-4" /> ADMIN
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
