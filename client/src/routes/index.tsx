import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Target, TrendingUp, GraduationCap, MessageSquare,
  BarChart3, Compass, Shield, ArrowRight, Check,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <HowItWorks />
      <Features />
      <RecommendationShowcase />
      <CompareDemo />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      <div className="mx-auto grid max-w-7xl grid-cols-12 items-start gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 pt-12 lg:col-span-6"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1">
            <span className="flex size-2 rounded-full bg-brand" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand">
              Admission Season 2026 · Active
            </span>
          </div>
          <h1 className="mb-8 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Precision routing for your <span className="text-brand">engineering future.</span>
          </h1>
          <p className="mb-10 max-w-[56ch] text-lg text-muted-foreground">
            Gredis is the AI admission co-pilot for diploma students. Match with the right
            polytechnic, compare colleges side-by-side, and get a personalized admission
            roadmap — all in under two minutes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="size-4" /> Start Assessment
            </Link>
            <Link
              to="/features"
              className="inline-flex h-12 items-center rounded-lg border border-border px-6 font-medium hover:bg-secondary"
            >
              See how it works
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>· No credit card</span>
            <span>· 5-question setup</span>
            <span>· Google & Email login</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative col-span-12 lg:col-span-6"
        >
          <div className="relative z-10 rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur-sm">
            <DashboardPreview />
          </div>
          <FloatingMatchCard />
        </motion.div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="grid aspect-[4/3] w-full grid-cols-[64px_1fr] overflow-hidden rounded-xl bg-background ring-1 ring-border">
      <aside className="flex flex-col gap-4 border-r border-border p-3">
        <div className="size-9 rounded-lg bg-brand/20 ring-1 ring-brand/40" />
        <div className="size-9 rounded-lg bg-secondary" />
        <div className="size-9 rounded-lg bg-secondary" />
        <div className="size-9 rounded-lg bg-secondary" />
        <div className="mt-auto size-9 rounded-full bg-secondary" />
      </aside>
      <div className="space-y-6 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Student Profile</p>
            <p className="text-sm font-medium">Aryan Kulkarni · 92.4%</p>
          </div>
          <div className="grid size-9 place-items-center rounded-full border border-brand text-[10px] font-mono text-brand">
            80%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Top Match</p>
            <p className="mt-1 text-xs font-medium">Govt Poly, Mumbai</p>
            <div className="mt-3 h-1 rounded-full bg-background">
              <div className="h-full w-[94%] rounded-full bg-brand" />
            </div>
            <p className="mt-1 font-mono text-[9px] text-brand">94% match</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 p-3">
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Stretch</p>
            <p className="mt-1 text-xs font-medium">VJTI, Mumbai</p>
            <div className="mt-3 h-1 rounded-full bg-background">
              <div className="h-full w-[42%] rounded-full bg-chart-3" />
            </div>
            <p className="mt-1 font-mono text-[9px] text-chart-3">42% reach</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="font-mono text-[10px] uppercase text-muted-foreground">AI Counselor</p>
          <p className="mt-1 text-xs">"Based on your 92.4%, focus on Round 1 of MSBTE for Computer Engineering."</p>
        </div>
      </div>
    </div>
  );
}

function FloatingMatchCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="absolute -left-8 bottom-12 hidden w-64 rounded-xl border border-border bg-surface p-5 shadow-2xl xl:block z-20"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] text-brand">AI MATCH SCORE</span>
        <span className="text-xs font-semibold text-brand">98.4%</span>
      </div>
      <p className="text-xs text-muted-foreground">COEP, Pune</p>
      <p className="mb-4 text-sm font-medium">Computer Technology</p>
      <div className="h-1 overflow-hidden rounded-full bg-secondary">
        <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} transition={{ duration: 1.4, delay: 0.6 }} className="h-full bg-brand" />
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">Strong probability · Round 1</p>
    </motion.div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Answer 5 quick questions", d: "State, 10th %, budget, branch, college type. Under 2 minutes." },
    { n: "02", t: "AI builds your profile", d: "Gemini analyzes cutoffs, fees, placement data across 450+ polytechnics." },
    { n: "03", t: "Get matched colleges", d: "Ranked recommendations with match score, pros, cons, and fees." },
    { n: "04", t: "Plan your admission", d: "Compare colleges, check eligibility, and follow your custom roadmap." },
  ];
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">How it works</p>
          <h2 className="font-display text-4xl font-semibold">From confused to committed in 4 steps.</h2>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-xl border border-border bg-surface/30 p-6"
            >
              <p className="mb-4 font-mono text-[10px] text-brand">{s.n} / STEP</p>
              <h3 className="mb-2 font-display text-lg font-semibold">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { i: Target, t: "Match Score Engine", d: "AI ranks colleges 0-100 across your budget, marks, location and career goals." },
    { i: Compass, t: "Branch Optimizer", d: "Discover the right engineering stream based on your aptitude and job market data." },
    { i: TrendingUp, t: "Cutoff Predictions", d: "Historical cutoff trends per branch, per round, per category." },
    { i: MessageSquare, t: "AI Admission Chat", d: "Ask anything about fees, documents, or deadlines — chat with your co-pilot." },
    { i: BarChart3, t: "Side-by-side Compare", d: "Compare fees, placements, hostel, and match score across colleges." },
    { i: Shield, t: "Eligibility Checker", d: "Instantly know which branches you qualify for — and why others don't." },
  ];
  return (
    <section id="features" className="border-t border-border bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">Features</p>
          <h2 className="font-display text-4xl font-semibold">Everything you need. Nothing you don't.</h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-background p-6 transition-colors hover:border-brand/40"
            >
              <div className="mb-4 grid size-10 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20">
                <f.i className="size-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecommendationShowcase() {
  const recs = [
    { name: "Government Polytechnic, Mumbai", score: 94, fee: "₹12,750", type: "Govt", tag: "TOP MATCH" },
    { name: "VJTI, Mumbai", score: 88, fee: "₹15,400", type: "Govt", tag: "STRONG FIT" },
    { name: "K. J. Somaiya Polytechnic", score: 82, fee: "₹78,000", type: "Private", tag: "SAFE PICK" },
  ];
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <motion.div {...fadeUp}>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">AI recommendations</p>
            <h2 className="font-display text-4xl font-semibold">Your personalized shortlist. Ranked.</h2>
          </motion.div>
          <motion.p {...fadeUp} className="text-muted-foreground">
            Gemini analyzes your profile against 450+ diploma institutes and delivers a ranked shortlist
            with match scores, fees, cutoffs, and why each fits.
          </motion.p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recs.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-surface/40 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded bg-brand/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-brand">
                  {r.tag}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{r.fee}/yr</span>
              </div>
              <h3 className="mb-1 font-display text-base font-semibold">{r.name}</h3>
              <p className="mb-6 text-xs text-muted-foreground">{r.type} · Diploma Engineering</p>
              <div className="h-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                  className="h-full bg-brand"
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>Match Score</span>
                <span className="text-brand">{r.score}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompareDemo() {
  const rows = [
    ["Metric", "Govt Poly, Pune", "GP, Nagpur"],
    ["Last Cutoff", "94.2%", "91.8%"],
    ["Annual Fees", "₹8,500", "₹7,800"],
    ["Placement", "82% · ₹4.1 LPA", "76% · ₹3.6 LPA"],
    ["Hostel", "Yes", "Yes"],
    ["AI Verdict", "Safe", "Very Safe"],
  ];
  return (
    <section className="border-t border-border bg-surface/20 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">Compare</p>
          <h2 className="font-display text-4xl font-semibold">Side-by-side clarity.</h2>
        </motion.div>
        <motion.div {...fadeUp} className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center gap-2 border-b border-border bg-surface/60 px-4 py-3">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-chart-3" />
            <span className="size-2.5 rounded-full bg-brand" />
            <span className="ml-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              compare_institutes.dat
            </span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border">
            {rows.map((r, ri) => (
              r.map((c, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className={`border-b border-border p-4 text-sm ${ri === 0 ? "font-mono text-[10px] uppercase text-muted-foreground" : ci === 0 ? "font-mono text-[10px] uppercase text-muted-foreground" : "font-medium"}`}
                >
                  {c}
                </div>
              ))
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    ["450+", "Institutes tracked"],
    ["12k+", "Students guided"],
    ["94%", "Match accuracy"],
    ["24/7", "AI counselor"],
  ];
  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map(([n, l]) => (
          <div key={l}>
            <div className="mb-2 font-display text-4xl font-semibold text-brand">{n}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { q: "Gredis matched me with Government Polytechnic Mumbai on day one. The match score was spot on.", a: "Priya S.", r: "Diploma in CS, MSBTE 2025" },
    { q: "Comparing 6 colleges side by side saved me weeks. The eligibility checker was a lifesaver.", a: "Rohan M.", r: "Diploma in ME, GTU 2025" },
    { q: "The AI chat answered every parent question my dad had. Fees, placements, hostel — all in one place.", a: "Aisha K.", r: "Diploma in IT, DTE 2025" },
  ];
  return (
    <section className="border-t border-border bg-surface/20 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mb-16 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">Loved by students</p>
          <h2 className="font-display text-4xl font-semibold">Real diploma students. Real admissions.</h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={t.a}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-xl border border-border bg-background p-6"
            >
              <GraduationCap className="mb-4 size-5 text-brand" />
              <p className="mb-6 text-sm text-foreground">"{t.q}"</p>
              <div className="mt-auto">
                <p className="text-sm font-medium">{t.a}</p>
                <p className="font-mono text-[10px] uppercase text-muted-foreground">{t.r}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is Gredis free?", a: "Yes — you can build your profile, get AI recommendations, and chat with the counselor for free." },
    { q: "Which states are supported?", a: "All Indian states with a State Board of Technical Education (MSBTE, GTU, DTE, etc.). We have deep data for Maharashtra, Gujarat, and Karnataka." },
    { q: "How accurate are the match scores?", a: "We combine your 10th %, category, budget and preferences with historical cutoffs and current placement data. Match accuracy is ~94% for last year's admissions." },
    { q: "Do you store my data?", a: "Your profile is saved to your account so recommendations improve over time. You can delete it anytime from Settings." },
    { q: "Can I compare private and government colleges?", a: "Yes — compare up to 4 colleges side-by-side across fees, placements, hostel and match score." },
  ];
  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">FAQ</p>
          <h2 className="font-display text-4xl font-semibold">Frequently asked.</h2>
        </motion.div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="font-display text-left text-base font-medium hover:text-brand">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="border-t border-border py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-surface to-background p-12 text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        </div>
        <h2 className="mb-4 font-display text-4xl font-semibold">Start your admission journey now.</h2>
        <p className="mb-8 text-muted-foreground">Free forever. No credit card. Setup in under 2 minutes.</p>
        <Link
          to="/signup"
          className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-6 font-semibold text-brand-foreground ring-1 ring-brand transition-transform hover:scale-[1.02]"
        >
          Create Free Account <ArrowRight className="size-4" />
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-6 font-mono text-[10px] uppercase text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="size-3 text-brand" /> Google login</span>
          <span className="flex items-center gap-1"><Check className="size-3 text-brand" /> Email login</span>
          <span className="flex items-center gap-1"><Check className="size-3 text-brand" /> AI recommendations</span>
        </div>
      </div>
    </section>
  );
}
