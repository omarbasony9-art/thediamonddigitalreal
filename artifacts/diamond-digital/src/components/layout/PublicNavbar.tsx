import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const adminLoggedIn = isAdminLoggedIn();
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/industries", label: "Industries" },
    { href: "/about", label: "About" },
  ];

  const servicesActive = location === "/services" || location === "/digital-marketing";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/5">
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt="Diamond Digital Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-base sm:text-xl tracking-wider text-white">
              DIAMOND<span className="text-primary">DIGITAL</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-gray-400 font-mono uppercase">
              Digital Marketing &amp; Software Development
            </span>
          </div>
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

          {/* Services dropdown */}
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm tracking-wide transition-colors hover:text-primary ${servicesActive ? "text-primary glow-text" : "text-muted-foreground"}`}
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-3 w-56 bg-card border border-white/10 py-1 z-50 shadow-xl"
                >
                  <Link
                    href="/digital-marketing"
                    onClick={() => setServicesOpen(false)}
                  >
                    <span className={`flex items-center px-5 py-3 text-sm tracking-wide transition-colors hover:text-primary hover:bg-primary/5 ${location === "/digital-marketing" ? "text-primary" : "text-muted-foreground"}`}>
                      Digital Marketing
                    </span>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setServicesOpen(false)}
                  >
                    <span className={`flex items-center px-5 py-3 text-sm tracking-wide transition-colors hover:text-primary hover:bg-primary/5 ${location === "/services" ? "text-primary" : "text-muted-foreground"}`}>
                      Software Development
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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

              {/* Mobile Services accordion */}
              <div>
                <button
                  className={`flex items-center justify-between w-full py-3 px-3 text-base tracking-wide rounded-md transition-colors ${servicesActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
                  onClick={() => setMobileServicesOpen((v) => !v)}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="ml-3 border-l border-white/10 overflow-hidden"
                    >
                      <Link href="/digital-marketing" onClick={() => { setIsOpen(false); setMobileServicesOpen(false); }}>
                        <span className={`flex py-2.5 px-4 text-sm tracking-wide transition-colors ${location === "/digital-marketing" ? "text-primary" : "text-muted-foreground hover:text-white"}`}>
                          Digital Marketing
                        </span>
                      </Link>
                      <Link href="/services" onClick={() => { setIsOpen(false); setMobileServicesOpen(false); }}>
                        <span className={`flex py-2.5 px-4 text-sm tracking-wide transition-colors ${location === "/services" ? "text-primary" : "text-muted-foreground hover:text-white"}`}>
                          Software Development
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2.5">
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
