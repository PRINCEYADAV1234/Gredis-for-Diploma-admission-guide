import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useProfile, useRecommendations, type College } from "@/lib/store";
import { generateRecommendations } from "@/lib/ai.functions";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const STATES = ["Maharashtra","Gujarat","Karnataka","Delhi","Tamil Nadu","Rajasthan","Uttar Pradesh","Kerala","Madhya Pradesh","West Bengal"];
const BRANCHES = ["Computer Engineering","Information Technology","Mechanical","Civil","Electrical","Electronics & Comm","AI & ML","Automobile","Chemical"];

type Step = { title: string; sub: string; key: string; render: (v: any, set: (v: any) => void) => React.ReactNode; validate: (v: any) => boolean };

export function Onboarding() {
  const nav = useNavigate();
  const [profile, setProfile] = useProfile();
  const [, setRecs] = useRecommendations();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({
    state: profile.state, tenthPercentage: profile.tenthPercentage,
    budget: profile.budget, preferredBranch: profile.preferredBranch, collegeType: profile.collegeType,
  });

  const steps: Step[] = [
    { title: "Which state?", sub: "Where do you want to take admission?", key: "state",
      validate: (v) => !!v,
      render: (v, set) => (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {STATES.map((s) => (
            <button key={s} type="button" onClick={() => set(s)}
              className={`rounded-lg border p-3 text-sm text-left transition-colors ${v === s ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-secondary"}`}>
              {s}
            </button>
          ))}
        </div>
      ),
    },
    { title: "10th percentage?", sub: "Your SSC / 10th grade result.", key: "tenthPercentage",
      validate: (v) => typeof v === "number" && v > 0 && v <= 100,
      render: (v, set) => (
        <div>
          <input type="number" min={35} max={100} step={0.1} value={(v as number) ?? ""}
            onChange={(e) => set(parseFloat(e.target.value))} placeholder="e.g. 82.5"
            className="h-14 w-full rounded-lg border border-border bg-background px-4 text-2xl font-mono focus:border-brand outline-none" />
          <p className="mt-2 font-mono text-[10px] uppercase text-muted-foreground">Enter percentage between 35 – 100</p>
        </div>
      ),
    },
    { title: "Annual budget?", sub: "Total tuition + hostel per year (INR).", key: "budget",
      validate: (v) => typeof v === "number" && v > 0,
      render: (v, set) => (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[10000, 25000, 50000, 100000].map((n) => (
              <button key={n} type="button" onClick={() => set(n)}
                className={`rounded-lg border p-3 text-sm font-mono transition-colors ${v === n ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-secondary"}`}>
                ₹{n.toLocaleString("en-IN")}
              </button>
            ))}
          </div>
          <input type="number" value={(v as number) ?? ""} onChange={(e) => set(parseFloat(e.target.value))}
            placeholder="Custom amount"
            className="h-12 w-full rounded-lg border border-border bg-background px-4 focus:border-brand outline-none font-mono" />
        </div>
      ),
    },
    { title: "Preferred branch?", sub: "Which engineering stream interests you most?", key: "preferredBranch",
      validate: (v) => !!v,
      render: (v, set) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BRANCHES.map((b) => (
            <button key={b} type="button" onClick={() => set(b)}
              className={`rounded-lg border p-3 text-sm text-left transition-colors ${v === b ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-secondary"}`}>
              {b}
            </button>
          ))}
        </div>
      ),
    },
    { title: "Government or private?", sub: "Which type of college do you prefer?", key: "collegeType",
      validate: (v) => !!v,
      render: (v, set) => (
        <div className="grid gap-2 sm:grid-cols-3">
          {[["government","Government","Lower fees, high demand"],["private","Private","Better infra, higher fees"],["both","Both","Show me everything"]].map(([k, l, d]) => (
            <button key={k} type="button" onClick={() => set(k)}
              className={`rounded-xl border p-4 text-left transition-colors ${v === k ? "border-brand bg-brand/10" : "border-border hover:bg-secondary"}`}>
              <p className={`font-display font-semibold ${v === k ? "text-brand" : ""}`}>{l}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </button>
          ))}
        </div>
      ),
    },
  ];

  const current = steps[step];
  const currentValue = values[current.key];
  const canNext = current.validate(currentValue);

  async function finish() {
    setLoading(true);
    try {
      const merged = { ...profile, ...values, onboarded: true };
      setProfile(merged);
      const recs = (await generateRecommendations(merged)) as College[];
      if (Array.isArray(recs) && recs.length > 0) setRecs(recs);
      toast.success("Recommendations ready");
      nav("/dashboard");
    } catch (e) {
      console.error(e);
      toast.error("Could not generate recommendations. You can retry from the dashboard.");
      setProfile({ ...profile, ...values, onboarded: true });
      nav("/dashboard");
    } finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      {loading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
            <Sparkles className="size-7 animate-pulse" />
          </div>
          <h2 className="mb-2 font-display text-3xl font-semibold">Generating your admission profile…</h2>
          <p className="text-sm text-muted-foreground">Analyzing 450+ institutes against your preferences.</p>
          <div className="mx-auto mt-8 h-1 w-64 overflow-hidden rounded-full bg-secondary">
            <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/3 bg-brand" />
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(((step + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <motion.div animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4 }} className="h-full bg-brand" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}>
              <h1 className="mb-2 font-display text-3xl font-semibold">{current.title}</h1>
              <p className="mb-8 text-sm text-muted-foreground">{current.sub}</p>
              {current.render(currentValue, (v) => setValues({ ...values, [current.key]: v }))}
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex items-center justify-between">
            <button disabled={step === 0} onClick={() => setStep(step - 1)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium disabled:opacity-40">
              <ArrowLeft className="size-4" /> Previous
            </button>
            {step < steps.length - 1 ? (
              <button disabled={!canNext} onClick={() => setStep(step + 1)}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground disabled:opacity-40">
                Next <ArrowRight className="size-4" />
              </button>
            ) : (
              <button disabled={!canNext} onClick={finish}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground disabled:opacity-40">
                Generate my profile <Sparkles className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
