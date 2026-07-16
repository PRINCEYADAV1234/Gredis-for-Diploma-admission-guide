import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";

export function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">About</p>
        <h1 className="mb-8 font-display text-5xl font-semibold">Built by students. For students.</h1>
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>
            Every year, lakhs of Indian students appear for diploma admissions. Most are guided by
            hearsay — a cousin's opinion, an outdated brochure, a coaching-center leaflet.
          </p>
          <p>
            Gredis exists to change that. We combine live cutoff data, placement statistics, fee
            structures, and Gemini's reasoning to give every student the same quality of guidance
            that a private counselor charges ₹50,000 for.
          </p>
          <p>
            Our promise is simple: precise, transparent, and free.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
