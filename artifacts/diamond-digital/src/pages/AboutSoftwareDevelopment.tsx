import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, MonitorSmartphone, Smartphone, Code2, LayoutDashboard, BarChart3, Plug, Zap, Server } from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Websites",
    desc: "Fast, conversion-optimized websites built for performance — not templates. Every site is engineered to load quickly, rank well, and turn visitors into leads.",
    features: ["Custom design & build", "CMS integration", "SEO-ready architecture"],
  },
  {
    icon: MonitorSmartphone,
    title: "Web Applications",
    desc: "Full-stack React and Node.js platforms with complex business logic, real-time data, and user authentication — built to production standards from day one.",
    features: ["React / Next.js", "REST & GraphQL APIs", "Real-time functionality"],
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    desc: "Native and cross-platform iOS and Android apps that perform flawlessly under real-world conditions — not just on a demo device.",
    features: ["React Native / Expo", "iOS & Android", "Offline-capable"],
  },
  {
    icon: Code2,
    title: "Custom Software",
    desc: "Bespoke systems designed around your exact business workflows — no off-the-shelf compromises, no forcing your process into someone else's product.",
    features: ["Workflow automation", "Custom logic engines", "Legacy modernization"],
  },
  {
    icon: LayoutDashboard,
    title: "Internal Tools",
    desc: "Admin panels, ops dashboards, and internal platforms that give your team clarity and control without needing to call a developer for every action.",
    features: ["Role-based access", "Data entry & CRUD", "Audit trails"],
  },
  {
    icon: BarChart3,
    title: "Dashboards",
    desc: "Executive and operational dashboards that surface the right data to the right people — built for speed, clarity, and actionable insight.",
    features: ["Real-time data", "Custom charts & KPIs", "Multi-source integration"],
  },
  {
    icon: Plug,
    title: "Integrations",
    desc: "We connect your stack — CRMs, payment processors, ERPs, marketing tools, shipping carriers, and anything else — so your systems work as one.",
    features: ["API integrations", "Webhook pipelines", "Third-party connectors"],
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "We identify repetitive work in your business and replace it with reliable, tested automation — freeing your team to focus on what actually matters.",
    features: ["Workflow automation", "Scheduled jobs", "Event-driven triggers"],
  },
  {
    icon: Server,
    title: "Ongoing Support",
    desc: "We don't disappear after launch. Retainer clients get priority support, continuous improvements, and a team that already knows their codebase.",
    features: ["Priority bug fixes", "Feature development", "Monitoring & uptime"],
  },
];

export default function AboutSoftwareDevelopment() {
  return (
    <div className="pt-[60px] pb-32 px-6">
      <div className="container mx-auto">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-20"
        >
          <p className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">About — Software Development</p>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
            SOFTWARE BUILT AROUND YOUR BUSINESS.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Diamond Digital's engineering practice builds software that solves real problems. We don't use templates, we don't cut corners, and we don't ship code we wouldn't stake our name on. Every project starts with understanding your business before touching a line of code.
          </p>
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.1 }}
              className="glass-panel p-8 group hover:border-primary/50 transition-colors"
            >
              <cap.icon className="w-10 h-10 text-primary mb-5 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold text-white mb-3">{cap.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{cap.desc}</p>
              <ul className="space-y-2">
                {cap.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/70 font-mono">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-mono text-sm px-10 h-12" asChild>
            <a href="/#quote">START A PROJECT</a>
          </Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/5 rounded-none font-mono text-sm px-10 h-12" asChild>
            <Link href="/services">VIEW ALL SERVICES</Link>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
