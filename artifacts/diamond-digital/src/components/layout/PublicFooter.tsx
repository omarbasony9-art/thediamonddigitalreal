import { Link } from "wouter";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/5 bg-background pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Software Diamond Logo" className="w-8 h-8 opacity-80" />
              <span className="font-display font-bold text-xl tracking-wider text-white">
                DIAMOND<span className="text-primary">DIGITAL</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Precision web building. We forge digital experiences that feel like stepping into a dark crystalline universe. Crafted like a diamond, sharp and confident.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-white mb-6 uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/industries" className="hover:text-primary transition-colors">Industries</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-white mb-6 uppercase tracking-widest text-sm">Portal</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/sign-in" className="hover:text-primary transition-colors">Client Login</Link></li>
              <li><Link href="/sign-up" className="hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Software Diamond. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
