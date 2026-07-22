import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateSite } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";

// ─── Project Types ────────────────────────────────────────────────────────────

const PROJECT_TYPES = [
  {
    id: "website",
    emoji: "🌐",
    title: "Build a Website",
    description: "Marketing sites, landing pages, portfolios — fully designed HTML/CSS/JS with AI that thinks like a creative director.",
    accent: "#0066ff",
    glow: "rgba(0, 102, 255, 0.15)",
  },
  {
    id: "spreadsheet",
    emoji: "📊",
    title: "Build a Spreadsheet",
    description: "Data tables, trackers, financial models, dashboards — AI generates beautiful spreadsheet UIs with real formulas and sample data.",
    accent: "#00b894",
    glow: "rgba(0, 184, 148, 0.15)",
  },
  {
    id: "application",
    emoji: "💻",
    title: "Make an Application",
    description: "Interactive tools, booking systems, CRMs, dashboards, forms — full web apps with real functionality and state management.",
    accent: "#6c5ce7",
    glow: "rgba(108, 92, 231, 0.15)",
  },
  {
    id: "qa",
    emoji: "🧠",
    title: "Answer My Question",
    description: "Deep research, complex analysis, math, science, law, code architecture — PhD-level answers from the smartest AI you've ever talked to.",
    accent: "#fdcb6e",
    glow: "rgba(253, 203, 110, 0.15)",
  },
  {
    id: "program",
    emoji: "👨‍💻",
    title: "Build a Program",
    description: "Python, JavaScript, algorithms, data processing — full working programs in any language, with explanations and production-quality code.",
    accent: "#e17055",
    glow: "rgba(225, 112, 85, 0.15)",
  },
  {
    id: "video",
    emoji: "🎬",
    title: "Make an AI Video",
    description: "Animated explainers, motion graphics, product demos, brand idents — HTML5 animations that play in-browser, no video files needed.",
    accent: "#fd79a8",
    glow: "rgba(253, 121, 168, 0.15)",
  },
] as const;

type ProjectTypeId = typeof PROJECT_TYPES[number]["id"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewProject() {
  const [selectedType, setSelectedType] = useState<ProjectTypeId | null>(null);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [, setLocation] = useLocation();
  const createSite = useCreateSite();
  const { toast } = useToast();

  const selected = PROJECT_TYPES.find((t) => t.id === selectedType);

  const handleCreate = () => {
    if (!selectedType || !projectName.trim()) return;
    createSite.mutate(
      {
        data: {
          projectName: projectName.trim(),
          clientName: clientName.trim() || "Personal Project",
          projectType: selectedType,
          tech: "react",
        },
      },
      {
        onSuccess: (site) => {
          setLocation(`/admin/sites/${site.id}`);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Failed to create project" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/sites">
          <button className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Create A New Project</h1>
          <p className="text-xs text-white/40 font-mono">Choose what you want to build</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Hero text */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            What would you like<br />
            <span style={{ color: "#0066ff" }}>to create?</span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Diamond AI adapts to your goal. Pick a category and describe what you need — it handles the rest.
          </p>
        </div>

        {/* Project type cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PROJECT_TYPES.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className="relative text-left rounded-2xl border p-6 transition-all duration-200 group overflow-hidden"
                style={{
                  background: isSelected ? type.glow : "rgba(255,255,255,0.02)",
                  borderColor: isSelected ? type.accent : "rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? `0 0 0 1px ${type.accent}, 0 8px 32px ${type.glow}` : "none",
                }}
              >
                {/* Glow blob on hover */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{ background: type.glow }}
                />

                {/* Checkmark */}
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: type.accent }}
                  >
                    ✓
                  </div>
                )}

                <div className="text-4xl mb-4">{type.emoji}</div>
                <h3
                  className="text-base font-bold mb-2 transition-colors"
                  style={{ color: isSelected ? type.accent : "white" }}
                >
                  {type.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{type.description}</p>
              </button>
            );
          })}
        </div>

        {/* Name form — appears after selecting a type */}
        <div
          className="transition-all duration-300 overflow-hidden"
          style={{
            maxHeight: selectedType ? "400px" : "0",
            opacity: selectedType ? 1 : 0,
          }}
        >
          {selected && (
            <div
              className="rounded-2xl border p-8"
              style={{
                background: selected.glow,
                borderColor: selected.accent + "40",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{selected.emoji}</span>
                <div>
                  <div className="text-sm font-mono text-white/40 uppercase tracking-widest">Selected</div>
                  <div className="font-bold text-white">{selected.title}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">
                    Project Name <span style={{ color: selected.accent }}>*</span>
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && projectName.trim()) handleCreate(); }}
                    placeholder={
                      selected.id === "qa" ? "e.g. Quantum Computing Research" :
                      selected.id === "program" ? "e.g. Data Sorting Tool" :
                      selected.id === "spreadsheet" ? "e.g. Q3 Budget Tracker" :
                      selected.id === "video" ? "e.g. Product Launch Intro" :
                      selected.id === "application" ? "e.g. Customer Dashboard" :
                      "e.g. Barber Shop Website"
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/50 uppercase tracking-widest mb-2">
                    Client / Owner <span className="text-white/25 normal-case tracking-normal font-sans">optional</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && projectName.trim()) handleCreate(); }}
                    placeholder="e.g. John Smith or Acme Corp"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={!projectName.trim() || createSite.isPending}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: projectName.trim() ? selected.accent : "rgba(255,255,255,0.1)",
                  color: selected.id === "qa" ? "#0a0a0a" : "white",
                }}
              >
                {createSite.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                ) : (
                  <>{selected.emoji} Create Project & Open Workspace</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Bottom hint */}
        {!selectedType && (
          <p className="text-center text-white/25 text-sm font-mono mt-4">
            ↑ select a project type to continue
          </p>
        )}
      </div>
    </div>
  );
}
