import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Code, Globe, Zap, Layers, Smartphone, LayoutTemplate } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: LayoutTemplate,
      title: "Landing Pages",
      desc: "High-converting, hyper-focused pages designed for specific marketing campaigns. We optimize for speed, clarity, and conversion metrics.",
      features: ["A/B Testing Ready", "Sub-second load times", "Analytics integration"]
    },
    {
      icon: Globe,
      title: "Business Websites",
      desc: "Comprehensive digital headquarters for modern enterprises. Built with a robust CMS or custom headless architecture to scale with your organization.",
      features: ["Custom CMS integration", "SEO optimized", "Scalable architecture"]
    },
    {
      icon: Zap,
      title: "E-Commerce",
      desc: "Immersive shopping experiences that remove friction from the buying process. We integrate with leading payment providers for seamless transactions.",
      features: ["Custom checkout flows", "Inventory sync", "Conversion optimized"]
    },
    {
      icon: Layers,
      title: "Portfolios & Showcases",
      desc: "Visually striking, highly animated experiences designed for creative agencies, artists, and luxury brands to showcase their work.",
      features: ["Complex WebGL animations", "Bespoke interactions", "Award-winning aesthetics"]
    },
    {
      icon: Code,
      title: "Custom Web Apps",
      desc: "Full-stack React applications with complex business logic, databases, and user authentication. Replit-grade functionality delivered flawlessly.",
      features: ["React/Next.js", "Serverless backends", "Real-time functionality"]
    },
    {
      icon: Smartphone,
      title: "Digital Ecosystems",
      desc: "Complete digital transformation packages. We build the frontend, the backend, the admin portals, and ensure everything connects flawlessly.",
      features: ["API design", "Microservices", "Admin dashboards"]
    }
  ];

  return (
    <div className="pt-24 pb-32 px-6">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-24"
        >
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6">OUR EXPERTISE</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We do not build templates. We engineer custom digital solutions designed to solve specific business problems. 
            Below are the core pillars of our capability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="glass-panel p-8 group hover:border-primary/50 transition-colors"
            >
              <service.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-display font-bold text-white mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">{service.desc}</p>
              
              <ul className="space-y-2 mb-8">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/80 font-mono">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full border-white/10 rounded-none font-mono group-hover:border-primary/30 group-hover:text-primary transition-colors" asChild>
                <Link href="/#quote">REQUEST SERVICE</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
