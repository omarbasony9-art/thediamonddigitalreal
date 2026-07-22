import { ReactNode, useEffect, useState } from "react";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

export function PublicLayout({ children }: { children: ReactNode }) {
  // Simple CSS starfield logic
  const [stars, setStars] = useState<{id: number, x: number, y: number, size: number, opacity: number}[]>([]);
  
  useEffect(() => {
    // Generate static stars once on client
    const generated = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2
    }));
    setStars(generated);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background text-foreground overflow-hidden">
      {/* Background Starfield */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, #0a1128 0%, #05050a 100%)" }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: star.size > 2 ? '0 0 4px 1px rgba(0, 255, 255, 0.4)' : 'none'
            }}
          />
        ))}
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNavbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
