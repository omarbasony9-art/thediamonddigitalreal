import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Megaphone, Share2, FileText, Users, Mail, Target, TrendingUp, LineChart, Palette } from "lucide-react";

const capabilities = [
  {
    icon: Megaphone,
    title: "Paid Advertising",
    desc: "We run paid campaigns across Meta, TikTok, LinkedIn, Pinterest, Google, and YouTube — built around your margins, not your impressions.",
    features: ["Search, Shopping & Display", "Meta & TikTok Ads", "Retargeting & lookalikes"],
  },
  {
    icon: Share2,
    title: "Social Media",
    desc: "Consistent, on-brand presence across every platform. We handle content, scheduling, community engagement, and growth strategy.",
    features: ["Multi-platform management", "Content calendars", "Community growth"],
  },
  {
    icon: FileText,
    title: "Content",
    desc: "Copywriting, graphic design, short-form video, and long-form content that earns trust and drives action at every stage of the funnel.",
    features: ["Copy & creative", "Short-form video", "Blog & long-form"],
  },
  {
    icon: Users,
    title: "Influencer Marketing",
    desc: "We identify, vet, and manage creator partnerships matched to your audience — from micro-influencers to large-scale campaigns.",
    features: ["Creator vetting & outreach", "Campaign management", "ROI reporting"],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    desc: "Welcome flows, nurture sequences, and broadcast campaigns engineered to convert subscribers into customers and keep them coming back.",
    features: ["Automated flows", "List segmentation", "A/B testing"],
  },
  {
    icon: Target,
    title: "Lead Generation",
    desc: "Funnels, landing pages, lead magnets, and outbound systems that fill your pipeline with qualified, ready-to-buy prospects.",
    features: ["Funnel builds", "Landing page design", "CRM integration"],
  },
  {
    icon: TrendingUp,
    title: "SEO",
    desc: "Technical, on-page, and off-page optimization that builds compounding organic traffic and ranks your business where it needs to be found.",
    features: ["Technical SEO audits", "Content strategy", "Link building"],
  },
  {
    icon: LineChart,
    title: "Analytics",
    desc: "Clear dashboards and regular reporting that show exactly what's working, what isn't, and where to reinvest for the highest return.",
    features: ["Custom dashboards", "Attribution tracking", "Monthly reporting"],
  },
  {
    icon: Palette,
    title: "Strategy",
    desc: "Before any campaign goes live, we audit your market, your competitors, and your audience to build a channel strategy aligned with real growth goals.",
    features: ["Market & competitor audit", "Channel planning", "Quarterly reviews"],
  },
];

export default function AboutDigitalMarketing() {
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
          <p className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">About — Digital Marketing</p>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
            MARKETING THAT MOVES THE NEEDLE.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Diamond Digital's marketing practice is built around one thing: measurable growth. We don't run campaigns for the sake of activity — every dollar is tracked, every channel is chosen deliberately, and every strategy is tied directly to your business goals.
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
            <a href="/#quote">START A CAMPAIGN</a>
          </Button>
          <Button variant="outline" className="border-white/20 hover:bg-white/5 rounded-none font-mono text-sm px-10 h-12" asChild>
            <Link href="/digital-marketing">VIEW ALL SERVICES</Link>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
