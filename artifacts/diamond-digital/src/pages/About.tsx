import { motion } from "framer-motion";
import { Code2, Server, Cloud, Shield, GitBranch, Database, Cpu, TestTube, LayoutTemplate, Zap, Globe, Lock } from "lucide-react";

const engineeringSkills = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    desc: "React, Next.js, Node.js, Python, Go, TypeScript — we work across the full spectrum. Our engineers own the entire stack, not just a slice of it.",
  },
  {
    icon: LayoutTemplate,
    title: "System & API Design",
    desc: "RESTful and GraphQL APIs, event-driven microservices, and distributed system architecture designed for reliability from the ground up.",
  },
  {
    icon: Database,
    title: "Database Architecture",
    desc: "Relational (PostgreSQL, MySQL), document (MongoDB), cache (Redis), and time-series stores — chosen and structured for the problem, not for convenience.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    desc: "AWS, Google Cloud, and Azure. We provision, automate, and monitor infrastructure that scales horizontally and recovers automatically.",
  },
  {
    icon: GitBranch,
    title: "DevOps & CI/CD",
    desc: "Automated test and deployment pipelines with zero-downtime releases. Docker, Kubernetes, GitHub Actions, Terraform — we run lean and ship often.",
  },
  {
    icon: Shield,
    title: "Security Engineering",
    desc: "OWASP best practices, HIPAA and SOC 2 compliance patterns, penetration-tested authentication, and data encryption at rest and in transit.",
  },
  {
    icon: Zap,
    title: "Performance Engineering",
    desc: "Core Web Vitals, database query optimization, CDN strategies, and load-tested architectures. We treat performance as a feature, not an afterthought.",
  },
  {
    icon: TestTube,
    title: "Testing & Quality",
    desc: "Unit, integration, and end-to-end test coverage as part of every delivery. We write tests because we care about correctness, not because we're told to.",
  },
  {
    icon: Cpu,
    title: "AI & ML Engineering",
    desc: "Practical AI integration — LLMs, vector databases, fine-tuned models, and autonomous agent frameworks built into real production systems.",
  },
  {
    icon: Server,
    title: "Backend Systems",
    desc: "Job queues, webhooks, event streaming with Kafka and RabbitMQ, and high-throughput data processing pipelines that hold up under real load.",
  },
  {
    icon: Globe,
    title: "Web Standards & Accessibility",
    desc: "Semantic HTML, ARIA compliance, WCAG 2.1 AA accessibility, and progressive enhancement so your product works for everyone.",
  },
  {
    icon: Lock,
    title: "Compliance & Data Privacy",
    desc: "GDPR, CCPA, HIPAA, and PCI-DSS patterns built into systems from the start — not bolted on after legal finds a problem.",
  },
];

const techStack = {
  "Languages": ["TypeScript", "Python", "Go", "Rust", "Java", "PHP"],
  "Frontend": ["React", "Next.js", "Vue.js", "Angular", "Svelte", "Expo"],
  "Backend": ["Node.js", "Express", "FastAPI", "Django", "Spring Boot", "Laravel"],
  "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQLite"],
  "Cloud": ["AWS", "Google Cloud", "Azure", "Vercel", "Cloudflare", "Railway"],
  "DevOps": ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "GitLab CI", "Datadog"],
};

const values = [
  {
    num: "/01",
    title: "Clarity Over Cleverness",
    text: "We write code the next engineer can understand. Simple, readable, maintainable systems outlast clever ones. We optimize for long-term clarity — not impressive-looking complexity.",
  },
  {
    num: "/02",
    title: "Precision at Every Layer",
    text: "From the database schema to the button radius, every decision is deliberate. Sloppy engineering at any layer creates compounding problems. We don't let details slide.",
  },
  {
    num: "/03",
    title: "Direct Ownership",
    text: "Every project has a lead engineer who owns the outcome, not just the tasks. You get accountability, not ticket trackers. If something's wrong, one person is responsible for making it right.",
  },
];

export default function About() {
  return (
    <div className="pt-24 pb-32 px-6">
      <div className="container mx-auto">

        {/* ── HEADER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-mono text-primary tracking-widest mb-4 uppercase">About Diamond Digital</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white mb-8 leading-tight break-words">
              ENGINEERING <br />
              <span className="text-primary">DONE RIGHT.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Most agencies build websites. We engineer software. The difference shows in performance, stability, and the fact that what we ship still works two years later without emergency patches.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Diamond Digital was built by engineers who got tired of watching technically sound projects get buried under poor architecture decisions, vague requirements, and teams that hand off instead of own. We operate with a different model — small, senior, accountable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative flex items-center justify-center"
          >
            {/* Radial glow behind the logo */}
            <div className="absolute w-72 h-72 bg-primary/10 blur-[100px] rounded-full" />
            <div className="absolute w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full" />
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="Diamond Digital"
              className="relative w-64 h-64 md:w-80 md:h-80 opacity-20 drop-shadow-[0_0_60px_rgba(0,255,255,0.15)] select-none pointer-events-none"
            />
          </motion.div>
        </div>

        {/* ── ENGINEERING SKILLS ── */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Competencies</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white">WHAT WE KNOW DEEPLY</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {engineeringSkills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="p-8 bg-background hover:bg-white/[0.03] transition-colors group"
              >
                <skill.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-base font-bold text-white mb-3 font-display">{skill.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── TECH STACK ── */}
        <div className="mb-32">
          <div className="mb-12">
            <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">Tools of the Trade</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">THE STACK</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Object.entries(techStack).map(([category, items], ci) => (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ci * 0.08 }}
              >
                <div className="text-xs font-mono text-primary tracking-widest uppercase mb-4">{category}</div>
                <ul className="space-y-2">
                  {items.map((item, ii) => (
                    <li key={ii} className="text-sm text-muted-foreground font-mono">{item}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── VALUES ── */}
        <div>
          <div className="mb-12">
            <p className="text-xs font-mono text-primary tracking-widest mb-3 uppercase">How We Think</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">OPERATING PRINCIPLES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-8 border border-white/5 bg-background/30 group hover:border-primary/20 transition-colors"
              >
                <div className="text-primary font-mono text-xl mb-5 group-hover:text-primary/80 transition-colors">{val.num}</div>
                <h3 className="text-xl font-bold text-white mb-4 font-display">{val.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
