import { motion } from "framer-motion";
import {
  Heart, ShoppingCart, Building2, BarChart2, Cpu, GraduationCap,
  Plane, Car, Store, UtensilsCrossed, Shirt, Factory, Film, Users, Scale
} from "lucide-react";

const industries = [
  {
    icon: Heart,
    name: "Healthcare",
    color: "from-rose-500/20 to-rose-500/5",
    accent: "rose-400",
    tagline: "Software that clinicians trust with patient outcomes.",
    desc: "We architect HIPAA-compliant systems where security isn't a checkbox — it's structural. Telemedicine platforms, patient management systems, clinical workflow automation, and care coordination tools built for real medical environments.",
    capabilities: ["Patient Portals & EHR Integration", "Telemedicine Platforms", "Clinical Workflow Automation", "HIPAA-Compliant Architecture"],
  },
  {
    icon: ShoppingCart,
    name: "eCommerce",
    color: "from-emerald-500/20 to-emerald-500/5",
    accent: "emerald-400",
    tagline: "Storefronts engineered to convert at every touchpoint.",
    desc: "Custom-built commerce platforms that out-perform templated solutions on speed, flexibility, and revenue-per-visitor. We handle inventory, orders, payments, and personalization — all optimized for scale.",
    capabilities: ["Custom Storefront Development", "Inventory & Order Management", "Personalization Engines", "Headless Commerce Architecture"],
  },
  {
    icon: Building2,
    name: "Real Estate",
    color: "from-amber-500/20 to-amber-500/5",
    accent: "amber-400",
    tagline: "PropTech that sells properties — not just lists them.",
    desc: "Listing portals with powerful search and filtering, virtual tour integrations, CRM connections, and tenant management systems. We make complex real estate workflows feel effortless for agents, landlords, and buyers alike.",
    capabilities: ["Property Listing Portals", "Virtual Tour Integration", "Real Estate CRM Tools", "Tenant Management Systems"],
  },
  {
    icon: BarChart2,
    name: "Finance & Banking",
    color: "from-blue-500/20 to-blue-500/5",
    accent: "blue-400",
    tagline: "Financial software where correctness is non-negotiable.",
    desc: "Trading dashboards, payment gateway integrations, banking platforms, and investment analytics tools built with financial-grade precision. We understand that every decimal point matters and every transaction must be auditable.",
    capabilities: ["Trading & Investment Platforms", "Payment Gateway Integration", "Financial Analytics Dashboards", "Compliance & Audit Trails"],
  },
  {
    icon: Cpu,
    name: "Technology",
    color: "from-cyan-500/20 to-cyan-500/5",
    accent: "cyan-400",
    tagline: "Software for companies that know software.",
    desc: "SaaS platforms, developer tooling, API products, and technical marketing sites that explain complex capabilities in plain language. We work with tech teams fluently — no translation layer needed.",
    capabilities: ["SaaS Platform Development", "Developer Tools & APIs", "Technical Documentation Sites", "Internal Tooling & Dashboards"],
  },
  {
    icon: GraduationCap,
    name: "Education",
    color: "from-violet-500/20 to-violet-500/5",
    accent: "violet-400",
    tagline: "EdTech that keeps learners engaged beyond the first session.",
    desc: "LMS platforms, virtual classrooms, student progress tracking, and institutional portals built for educators who take learning outcomes seriously. We make learning software that teachers choose to use, not just tolerate.",
    capabilities: ["LMS Platform Development", "Virtual Classroom Tools", "Progress Tracking Systems", "Student & Instructor Portals"],
  },
  {
    icon: Plane,
    name: "Travel",
    color: "from-sky-500/20 to-sky-500/5",
    accent: "sky-400",
    tagline: "Travel platforms that handle the chaos of real itineraries.",
    desc: "Booking engines, reservation systems, AI-driven travel recommendations, and guest experience platforms that handle multi-stop complexity gracefully. We build for the traveler who expects nothing to go wrong.",
    capabilities: ["Booking & Reservation Engines", "AI Travel Recommendations", "Itinerary Management", "Guest Experience Systems"],
  },
  {
    icon: Car,
    name: "Automotive",
    color: "from-orange-500/20 to-orange-500/5",
    accent: "orange-400",
    tagline: "Digital systems as reliable as a well-engineered vehicle.",
    desc: "Dealer platforms, vehicle configurators, service scheduling systems, fleet management dashboards, and parts catalogs. We understand the complexity of automotive inventory and make it manageable through clean software.",
    capabilities: ["Dealer Management Platforms", "Vehicle Configurators", "Fleet Tracking & Management", "Service Scheduling Systems"],
  },
  {
    icon: Store,
    name: "Retail",
    color: "from-pink-500/20 to-pink-500/5",
    accent: "pink-400",
    tagline: "Omnichannel retail software that bridges the physical and digital.",
    desc: "Inventory systems, loyalty platforms, POS integrations, and customer data platforms for retailers operating across channels. We make the in-store and online experience feel like one cohesive brand.",
    capabilities: ["Inventory Management Systems", "Loyalty & Rewards Platforms", "POS Integration", "Customer Data Platforms"],
  },
  {
    icon: UtensilsCrossed,
    name: "Food & Beverage",
    color: "from-yellow-500/20 to-yellow-500/5",
    accent: "yellow-400",
    tagline: "Restaurant and food brand software that actually runs smoothly.",
    desc: "Online ordering systems, delivery integrations, reservation platforms, menu management tools, and loyalty apps built for the speed of service. We know that downtime in F&B is revenue, not just inconvenience.",
    capabilities: ["Online Ordering Platforms", "Reservation & Table Management", "Menu Management Tools", "Loyalty & Subscription Apps"],
  },
  {
    icon: Shirt,
    name: "Fashion & Apparel",
    color: "from-fuchsia-500/20 to-fuchsia-500/5",
    accent: "fuchsia-400",
    tagline: "Fashion platforms where visual presentation is part of the product.",
    desc: "Custom storefronts with advanced visual merchandising, size recommendation engines, lookbook builders, and AR try-on integrations. We build for fashion brands that understand their website is their showroom.",
    capabilities: ["Visual Merchandising Platforms", "Size Recommendation Engines", "Lookbook & Editorial Tools", "AR Try-On Integration"],
  },
  {
    icon: Factory,
    name: "Manufacturing",
    color: "from-slate-400/20 to-slate-400/5",
    accent: "slate-300",
    tagline: "Industrial software that operates as reliably as the machinery it monitors.",
    desc: "Supply chain visibility, production tracking, quality assurance dashboards, and B2B ordering portals for manufacturers who need software as dependable as their equipment.",
    capabilities: ["Supply Chain Visibility Tools", "Production Tracking Systems", "Quality Assurance Dashboards", "B2B Customer Portals"],
  },
  {
    icon: Film,
    name: "Entertainment & Media",
    color: "from-purple-500/20 to-purple-500/5",
    accent: "purple-400",
    tagline: "Media platforms built to hold audiences at scale.",
    desc: "Streaming infrastructure, content management systems, fan engagement platforms, and media distribution networks. We build for the traffic spikes that come with viral moments and live events.",
    capabilities: ["Streaming Platform Infrastructure", "Content Management Systems", "Fan Engagement Tools", "Media Distribution Networks"],
  },
  {
    icon: Users,
    name: "Non-Profit",
    color: "from-teal-500/20 to-teal-500/5",
    accent: "teal-400",
    tagline: "Software that multiplies the impact of every dollar.",
    desc: "Donor management systems, volunteer coordination platforms, fundraising campaign tools, and impact dashboards that help mission-driven organizations do more with constrained resources.",
    capabilities: ["Donor Management Systems", "Volunteer Coordination Platforms", "Fundraising Campaign Tools", "Impact & Reporting Dashboards"],
  },
  {
    icon: Scale,
    name: "Legal Services",
    color: "from-indigo-500/20 to-indigo-500/5",
    accent: "indigo-400",
    tagline: "Legal software where security and precision are the baseline.",
    desc: "Secure client portals, document automation systems, case management tools, and law firm websites that project credibility and generate qualified leads. We understand privilege, confidentiality, and the compliance implications of every design decision.",
    capabilities: ["Secure Client Portals", "Document Automation", "Case Management Systems", "Lead Generation Sites"],
  },
];

export default function Industries() {
  return (
    <div className="pt-24 pb-32 px-6">
      <div className="container mx-auto">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-24"
        >
          <p className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">Domain Knowledge</p>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6 leading-tight">
            DOMAINS WE'VE <br />WORKED IN
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Every industry has its own compliance landscape, user expectations, and technical constraints. We bring genuine domain knowledge to every engagement — not a generic feature list.
          </p>
        </motion.div>

        {/* ── INDUSTRY GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className={`relative p-8 border border-white/8 bg-gradient-to-br ${ind.color} hover:border-white/20 transition-all duration-300 group overflow-hidden`}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 border border-white/10 bg-background/40 flex items-center justify-center group-hover:border-white/20 transition-colors">
                  <ind.icon className={`w-6 h-6 text-${ind.accent}`} />
                </div>
                <span className="text-xs font-mono text-muted-foreground/50 tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-2">{ind.name}</h3>
              <p className={`text-xs font-mono text-${ind.accent} mb-4 leading-relaxed`}>{ind.tagline}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{ind.desc}</p>

              {/* Capabilities */}
              <ul className="space-y-1.5">
                {ind.capabilities.map((cap, ci) => (
                  <li key={ci} className="flex items-center gap-2 text-xs text-muted-foreground/70 font-mono">
                    <div className={`w-1 h-1 bg-${ind.accent} shrink-0`} />
                    {cap}
                  </li>
                ))}
              </ul>

              {/* Hover glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-primary" />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
