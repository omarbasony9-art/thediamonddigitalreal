import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Megaphone, Target, Share2, FileText, Users, Mail, BarChart3, TrendingUp, Palette, LineChart } from "lucide-react";
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
  {
    icon: Megaphone,
    title: "Paid Social Advertising",
    desc: "Meta, TikTok, LinkedIn, and Pinterest campaigns that reach the right audience and convert attention into action.",
    features: ["Meta & TikTok Ads", "Audience targeting", "Creative testing"],
  },
  {
    icon: Target,
    title: "Google Ads / PPC",
    desc: "Search, Shopping, Display, and YouTube campaigns managed for maximum return on every dollar spent.",
    features: ["Search & Shopping", "Conversion tracking", "Bid optimization"],
  },
  {
    icon: Share2,
    title: "Social Media Management",
    desc: "Consistent, on-brand presence across every platform — content, scheduling, community, and growth.",
    features: ["Multi-platform posting", "Community management", "Growth strategy"],
  },
  {
    icon: FileText,
    title: "Content Creation",
    desc: "Copywriting, graphics, video, and creative assets that communicate your value and build trust with your audience.",
    features: ["Copy & design", "Short-form video", "Brand voice"],
  },
  {
    icon: Users,
    title: "Influencer Marketing",
    desc: "Vetted creator partnerships matched to your niche, managed from outreach to reporting.",
    features: ["Creator vetting", "End-to-end management", "ROI reporting"],
  },
  {
    icon: Mail,
    title: "Email Marketing",
    desc: "Welcome flows, nurture sequences, and broadcast campaigns that turn subscribers into customers.",
    features: ["Automated flows", "List segmentation", "A/B testing"],
  },
  {
    icon: BarChart3,
    title: "Lead Generation",
    desc: "Funnels, landing pages, and outbound systems that fill your pipeline with qualified, ready-to-buy prospects.",
    features: ["Funnel builds", "Landing pages", "CRM integration"],
  },
  {
    icon: TrendingUp,
    title: "SEO",
    desc: "Technical, on-page, and off-page optimization that compounds over time and drives organic revenue.",
    features: ["Technical SEO", "Content strategy", "Link building"],
  },
  {
    icon: Palette,
    title: "Branding & Creative Strategy",
    desc: "Positioning, visual identity, and messaging frameworks that make your brand unmistakable in any market.",
    features: ["Brand identity", "Messaging framework", "Visual guidelines"],
  },
  {
    icon: LineChart,
    title: "Marketing Analytics & Reporting",
    desc: "Clear dashboards and regular reporting that show exactly what's working, what isn't, and what to do next.",
    features: ["Custom dashboards", "Monthly reporting", "Attribution tracking"],
  },
];

const processSteps = [
  {
    num: "01",
    title: "Audit & Strategy",
    text: "We analyze your current presence, competitors, and audience. Then we build a channel strategy aligned with your actual growth goals.",
  },
  {
    num: "02",
    title: "Launch & Optimize",
    text: "Campaigns go live fast. We test, measure, and iterate continuously — cutting what doesn't work, scaling what does.",
  },
  {
    num: "03",
    title: "Report & Scale",
    text: "Every result is tracked and explained. As performance improves, we reinvest intelligently and expand what's working.",
  },
];

export default function DigitalMarketing() {
  const { toast } = useToast();
  const createQuote = useCreateQuote();

  const form = useForm<z.infer<typeof quoteSchema>>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "", email: "", phone: "", company: "",
      projectType: "business_site", description: "", budget: "", timeline: "",
    },
  });

  const onSubmit = (data: z.infer<typeof quoteSchema>) => {
    createQuote.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Request received", description: "We'll review your details and respond within 24 hours." });
        form.reset();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Submission failed", description: "Please try again or email us directly." });
      },
    });
  };

  return (
    <div className="flex flex-col">

      {/* ── SERVICES GRID ── */}
      <div className="pb-32 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6">OUR EXPERTISE</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From paid media and social strategy to SEO, content, and analytics — Diamond Digital covers every channel of growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
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
                  <a href="#quote">REQUEST SERVICE</a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">START GROWING</h2>
            <p className="text-muted-foreground">Tell us about your business and goals. We'll respond within 24 hours.</p>
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
                    <FormLabel className="text-white">What are you looking for? *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-white/10 rounded-none focus:ring-primary h-12">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-white/10 rounded-none">
                        <SelectItem value="landing_page">Paid Advertising</SelectItem>
                        <SelectItem value="business_site">Social Media Management</SelectItem>
                        <SelectItem value="ecommerce">SEO</SelectItem>
                        <SelectItem value="portfolio">Content Creation</SelectItem>
                        <SelectItem value="web_app">Lead Generation</SelectItem>
                        <SelectItem value="other">Something Else</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tell us about your goals *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, current marketing efforts, target audience, and what growth looks like for you..."
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
                      <FormLabel className="text-white">Monthly Budget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-white/10 rounded-none focus:ring-primary h-12">
                            <SelectValue placeholder="Select a range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10 rounded-none">
                          <SelectItem value="<10k">Under $1,000/mo</SelectItem>
                          <SelectItem value="10k-25k">$1,000 – $3,000/mo</SelectItem>
                          <SelectItem value="25k-50k">$3,000 – $10,000/mo</SelectItem>
                          <SelectItem value="50k+">$10,000+/mo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="timeline" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">When do you want to start?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-white/10 rounded-none focus:ring-primary h-12">
                            <SelectValue placeholder="Select a timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-white/10 rounded-none">
                          <SelectItem value="asap">As soon as possible</SelectItem>
                          <SelectItem value="1-3_months">Within a month</SelectItem>
                          <SelectItem value="3-6_months">1–3 months</SelectItem>
                          <SelectItem value="flexible">Just exploring</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button
                  type="submit"
                  disabled={createQuote.isPending}
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-sm tracking-widest font-mono rounded-none"
                >
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
