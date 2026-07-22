import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Code2, Cpu, Zap, Server, Cloud, Layers, Palette, BarChart3, Bot, Database, Lock, MonitorSmartphone, GitBranch } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateQuote } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const quoteSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.enum(["landing_page", "business_site", "ecommerce", "portfolio", "web_app", "other"]),
  description: z.string().min(10, "Please provide more details about your project"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

const services = [
  { icon: Globe, title: "Web Applications", desc: "Full-stack platforms engineered on modern React and Node.js architectures — fast, scalable, production-ready." },
  { icon: MonitorSmartphone, title: "Mobile Development", desc: "Native and cross-platform iOS and Android apps that perform flawlessly under real-world conditions." },
  { icon: Code2, title: "Custom Software", desc: "Bespoke systems designed around your exact business workflows — no off-the-shelf compromises." },
  { icon: Bot, title: "AI & Automation", desc: "Intelligent pipelines and AI-powered features that reduce overhead and amplify what your team can do." },
  { icon: Server, title: "Backend Engineering", desc: "Secure, high-throughput APIs and data services built to handle growth from day one." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "CI/CD infrastructure and cloud architecture that ships reliably, scales automatically, and fails gracefully." },
  { icon: Palette, title: "UI/UX Design", desc: "Interfaces built around documented user behavior — not intuition, not trends, not templates." },
  { icon: BarChart3, title: "Data & Analytics", desc: "Systems that extract actionable signal from raw data and surface it to the people who need it." },
];

const aiCapabilities = [
  { title: "AI Integration", desc: "Embed intelligent decision-making directly into your product's core workflows." },
  { title: "Generative AI", desc: "LLM-powered features — content generation, semantic search, intelligent agents." },
  { title: "Machine Learning", desc: "Predictive models and pattern recognition that improve as your data grows." },
  { title: "AI Agent Frameworks", desc: "Autonomous agents that execute multi-step tasks, analyze data, and respond in real time." },
  { title: "Cloud Infrastructure", desc: "AWS, GCP, and Azure architecture that scales to demand without scaling your bills unnecessarily." },
  { title: "Data Engineering", desc: "Pipelines, warehouses, and analytics stacks that make your data actually useful." },
  { title: "Progressive Web Apps", desc: "App-store-quality experiences in the browser — installable, offline-capable, cross-device." },
  { title: "Payment Systems", desc: "Checkout flows, recurring billing, marketplace payouts — integrated with reliability and security." },
  { title: "IoT & Device Networks", desc: "Connected device platforms with real-time telemetry, remote control, and monitoring dashboards." },
  { title: "CI/CD Automation", desc: "Automated testing and deployment pipelines so your team ships fast without breaking production." },
];

const domainList = [
  "Healthcare", "eCommerce", "Real Estate", "Finance & Banking", "Technology",
  "Education", "Travel", "Automotive", "Retail", "Food & Beverage",
  "Fashion & Apparel", "Manufacturing", "Entertainment & Media", "Non-Profit", "Legal Services"
];

const processSteps = [
  { num: "01", title: "Discovery & Architecture", text: "We start by understanding your problem, your users, and your constraints. Then we design a technical architecture before touching a line of code." },
  { num: "02", title: "Iterative Engineering", text: "We build in focused sprints with regular demos. You see real progress. We catch real problems early. Nothing ships without your sign-off." },
  { num: "03", title: "Launch & Evolution", text: "Delivery is the beginning, not the end. We handle deployment, monitoring, and ongoing iteration as your product grows." },
];

export default function Home() {
  const { toast } = useToast();
  const createQuote = useCreateQuote();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", projectType: "business_site", description: "", budget: "", timeline: "" },
  });

  const onSubmit = (data: z.infer<typeof quoteSchema>) => {
    createQuote.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Request received", description: "We'll review your details and respond within 24 hours." });
        form.reset();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Submission failed", description: "Please try again or email us directly." });
      }
    });
  };

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-32 px-6 overflow-hidden">
        <div className="container mx-auto text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary uppercase tracking-widest">Custom Software Engineering</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-[88px] font-display font-black text-white leading-[1.05] mb-4 tracking-tighter"
          >
            ENGINEERING
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-5xl md:text-7xl lg:text-[88px] font-display font-black leading-[1.05] mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary glow-text"
          >
            THAT ENDURES.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Software Diamond builds custom software, web platforms, and digital products that are sharp by design, scalable by architecture, and exceptional by default. No templates. No shortcuts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none w-full sm:w-auto text-sm tracking-widest font-mono h-14 px-10" asChild>
              <a href="#quote">START A PROJECT</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 rounded-none w-full sm:w-auto text-sm tracking-widest font-mono h-14 px-10" asChild>
              <Link href="/services">OUR SERVICES</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-16 flex items-center justify-center gap-12 text-xs font-mono text-muted-foreground/60 tracking-widest"
          >
            {["15+ INDUSTRIES", "FULL-STACK TEAMS", "SHIPPING SINCE 2018"].map((s, i) => (
              <span key={i} className="hidden sm:block">{s}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-32 px-6 bg-card border-y border-white/5 relative">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">What We Build</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white">CAPABILITIES</h2>
            </div>
            <Button variant="link" className="text-primary hover:text-primary/80 gap-2 font-mono text-sm" asChild>
              <Link href="/services">FULL SERVICE LIST <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.07 }}
                className="p-8 bg-background hover:bg-white/[0.03] transition-colors group cursor-default"
              >
                <svc.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-base font-bold text-white mb-3 font-display">{svc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI & TECHNOLOGY CAPABILITIES ── */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Technology Stack</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              AI-POWERED. <br />FUTURE-READY.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              We combine modern AI capabilities with proven engineering discipline to build products that do more — and cost less to maintain.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiCapabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.06 }}
                className="p-5 border border-white/8 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="w-1 h-4 bg-primary mb-4 group-hover:h-6 transition-all duration-300" />
                <h4 className="text-white text-sm font-bold mb-2">{cap.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOMAINS WE'VE WORKED IN ── */}
      <section className="py-24 px-6 bg-card border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Experience</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">DOMAINS WE'VE WORKED IN</h2>
            </div>
            <Button variant="link" className="text-primary hover:text-primary/80 gap-2 font-mono text-sm" asChild>
              <Link href="/industries">EXPLORE ALL <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {domainList.map((domain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href="/industries">
                  <span className="inline-block px-5 py-2.5 border border-white/10 text-muted-foreground text-sm font-mono tracking-wide hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer">
                    {domain}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Process</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">HOW WE WORK</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-10 relative group"
              >
                <div className="w-16 h-16 border border-primary/30 bg-primary/5 flex items-center justify-center text-primary font-mono text-lg font-bold mb-6 group-hover:bg-primary/10 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-display">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="quote" className="py-32 px-6 bg-card border-t border-white/5 relative">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Get Started</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">START A CONVERSATION</h2>
            <p className="text-muted-foreground">Tell us what you're building. We'll respond with a plan, not a sales pitch.</p>
          </div>

          <div className="glass-panel p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name *</FormLabel>
                      <FormControl><Input placeholder="Jane Smith" className="bg-background border-white/10 rounded-none focus-visible:ring-primary h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email Address *</FormLabel>
                      <FormControl><Input type="email" placeholder="jane@company.com" className="bg-background border-white/10 rounded-none focus-visible:ring-primary h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company</FormLabel>
                      <FormControl><Input placeholder="Acme Corp" className="bg-background border-white/10 rounded-none focus-visible:ring-primary h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone</FormLabel>
                      <FormControl><Input type="tel" placeholder="+1 (555) 000-0000" className="bg-background border-white/10 rounded-none focus-visible:ring-primary h-12" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="projectType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">What are you building? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-white/10 rounded-none focus:ring-primary h-12">
                          <SelectValue placeholder="Select a project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-white/10 rounded-none">
                        <SelectItem value="landing_page">Landing Page</SelectItem>
                        <SelectItem value="business_site">Business Website</SelectItem>
                        <SelectItem value="ecommerce">E-Commerce Platform</SelectItem>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="web_app">Custom Web Application</SelectItem>
                        <SelectItem value="other">Something Else</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tell us about the project *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your goals, who it's for, what problem it solves, and any constraints we should know about..."
                        className="bg-background border-white/10 rounded-none focus-visible:ring-primary min-h-[140px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="budget" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-white/10 rounded-none focus:ring-primary h-12">
                            <SelectValue placeholder="Select a range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10 rounded-none">
                          <SelectItem value="<10k">Under $10k</SelectItem>
                          <SelectItem value="10k-25k">$10k – $25k</SelectItem>
                          <SelectItem value="25k-50k">$25k – $50k</SelectItem>
                          <SelectItem value="50k+">$50k+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="timeline" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Ideal Timeline</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-white/10 rounded-none focus:ring-primary h-12">
                            <SelectValue placeholder="Select a timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10 rounded-none">
                          <SelectItem value="asap">As soon as possible</SelectItem>
                          <SelectItem value="1-3_months">1–3 months</SelectItem>
                          <SelectItem value="3-6_months">3–6 months</SelectItem>
                          <SelectItem value="flexible">Flexible / not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={createQuote.isPending} className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-widest font-mono rounded-none">
                  {createQuote.isPending ? "SENDING..." : "SEND INQUIRY"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
}
