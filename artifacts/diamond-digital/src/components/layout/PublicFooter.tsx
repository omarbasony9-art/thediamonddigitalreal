import { Link } from "wouter";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-background pt-14 sm:pt-20 pb-8 sm:pb-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Diamond Digital Logo" className="w-7 h-7 opacity-80" />
              <span className="font-display font-bold text-lg tracking-wider text-white">
                DIAMOND<span className="text-primary">DIGITAL</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-4">
              Precision web building. We forge digital experiences that feel like stepping into a dark crystalline universe. Crafted like a diamond, sharp and confident.
            </p>
            <p className="text-muted-foreground/60 text-xs font-mono">
              Diamond Digital is a subsidiary of The Titan Media.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-white mb-5 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/digital-marketing" className="hover:text-primary transition-colors">Digital Marketing</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Software Development</Link></li>
              <li><Link href="/industries" className="hover:text-primary transition-colors">Industries</Link></li>
              <li><Link href="/about/digital-marketing" className="hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-white mb-5 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Diamond Digital. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
