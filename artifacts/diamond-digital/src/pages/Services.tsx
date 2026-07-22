import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Code, Globe, Zap, Layers, Smartphone, LayoutTemplate, Star, Quote } from "lucide-react";

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

const reviews = [
  {
    name: "Marcus T.",
    role: "CEO, NovaTech Solutions",
    rating: 5,
    text: "Software Diamond delivered our SaaS dashboard six days ahead of schedule. The code quality was unlike anything we'd seen from a previous agency — clean, documented, and actually scalable. We've since expanded the engagement twice.",
    service: "Custom Web App",
    avatar: "MT",
  },
  {
    name: "Priya S.",
    role: "Founder, ArchiDesign Studio",
    rating: 5,
    text: "I showed them three reference images and a mood board and they came back with something that exceeded every expectation. The portfolio site has won us three new clients since launch. Worth every dollar.",
    service: "Portfolio & Showcase",
    avatar: "PS",
  },
  {
    name: "James O.",
    role: "Head of Growth, GreenLeaf Co",
    rating: 5,
    text: "Our e-commerce conversion rate went up 34% after launch. The checkout flow they built is faster and cleaner than what we had on Shopify, and we now own it completely. Genuinely transformative work.",
    service: "E-Commerce",
    avatar: "JO",
  },
  {
    name: "Rachel M.",
    role: "VP Marketing, Pacific Dental Group",
    rating: 5,
    text: "We briefed them on a Tuesday, had a live staging environment by Thursday, and launched the full multi-location site in under three weeks. The communication throughout was exceptional — never in the dark.",
    service: "Business Website",
    avatar: "RM",
  },
  {
    name: "Carlos R.",
    role: "Director, Riverside Financial",
    rating: 5,
    text: "Trust is everything in finance. Software Diamond understood that without us having to explain it twice. The site they built projects exactly the credibility we needed. Lead quality from the site improved immediately.",
    service: "Business Website",
    avatar: "CR",
  },
  {
    name: "Emma W.",
    role: "Co-Founder, Bite Bright",
    rating: 5,
    text: "We needed a high-converting landing page fast for our launch campaign. They shipped in 11 days. Our sign-up CPA dropped by 40% compared to our old page. Already planning the v2 with them.",
    service: "Landing Page",
    avatar: "EW",
  },
];

function StarRow() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
      ))}
    </div>
  );
}

export default function Services() {
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

        {/* ── SERVICE CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
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

        {/* ── CLIENT REVIEWS ── */}
        <div>
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Client Reviews</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">WHAT OUR CLIENTS SAY</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real results from real companies. No cherry-picked quotes — these are the outcomes we hold ourselves to.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-white font-bold text-lg">5.0</span>
              <span className="text-muted-foreground text-sm font-mono">· {reviews.length} reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="relative p-8 border border-white/8 bg-card/30 hover:border-white/20 hover:bg-card/50 transition-all duration-300 flex flex-col"
              >
                {/* Quote mark */}
                <Quote className="w-6 h-6 text-primary/30 mb-4 shrink-0" />

                {/* Review text */}
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
                  "{review.text}"
                </p>

                {/* Service tag */}
                <div className="mb-5">
                  <span className="text-[10px] font-mono tracking-widest text-primary/70 border border-primary/20 bg-primary/5 px-2 py-1">
                    {review.service.toUpperCase()}
                  </span>
                </div>

                {/* Stars */}
                <StarRow />

                {/* Author */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/8">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono text-xs font-bold shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">{review.name}</div>
                    <div className="text-muted-foreground text-xs">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-sm px-10 h-12" asChild>
              <Link href="/#quote">START YOUR PROJECT</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
