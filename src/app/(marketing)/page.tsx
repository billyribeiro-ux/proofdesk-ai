import Link from "next/link";
import {
  Shield,
  Clock,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Sparkles,
  Menu,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Canonical Timeline",
    description:
      "Automatically ingest and normalize work signals from any tool into a single source of truth.",
  },
  {
    icon: Sparkles,
    title: "AI Status Copilot",
    description:
      "Generate traceable status summaries with one click. Regenerate in standard, strict, or executive variants.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Monitor",
    description:
      "Detect scope creep, delivery delays, blockers, and budget overruns before they become problems.",
  },
  {
    icon: CheckCircle2,
    title: "Approvals Center",
    description:
      "Route client approvals and internal signoffs with full audit trail and decision history.",
  },
  {
    icon: CreditCard,
    title: "Billing Packets",
    description:
      "Generate invoice-ready evidence bundles tied directly to actual work performed and approved.",
  },
  {
    icon: Shield,
    title: "Immutable Audit Log",
    description:
      "Every action logged. Every decision traceable. Full compliance confidence for your clients.",
  },
];

const steps = [
  { title: "Connect", desc: "Ingest work signals from your tools" },
  { title: "Normalize", desc: "Build a canonical event timeline" },
  { title: "Summarize", desc: "AI generates traceable status reports" },
  { title: "Monitor", desc: "Detect risks and scope creep early" },
  { title: "Approve", desc: "Route signoffs with full audit trail" },
  { title: "Package", desc: "Generate billing evidence packets" },
  { title: "Audit", desc: "Immutable log of every action taken" },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-base font-semibold text-text">
              ProofDesk <span className="text-primary">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-[13px] font-medium text-text-muted transition-colors hover:text-text"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-[13px] font-medium text-text-muted transition-colors hover:text-text"
            >
              How It Works
            </Link>
            <div className="h-4 w-px bg-border" />
            <Link
              href="/auth/signin"
              className="text-[13px] font-medium text-text-muted transition-colors hover:text-text"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-primary-hover"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-subtle hover:text-text md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden noise">
          {/* Animated gradient mesh background */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/[0.08] via-secondary/[0.04] to-transparent blur-3xl animate-hero-glow" />
            <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-secondary/[0.05] blur-3xl animate-hero-glow" style={{ animationDelay: "-7s" }} />
            <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-3xl animate-hero-glow" style={{ animationDelay: "-14s" }} />
          </div>

          <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-40">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-4 py-1.5 text-xs font-semibold tracking-wide text-primary animate-fade-in-down animate-border-glow">
                <FileCheck className="h-3.5 w-3.5" />
                AI Governance Platform
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                Turn work activity into{" "}
                <span className="text-gradient-animated">
                  trusted client evidence
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg sm:leading-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                ProofDesk AI automatically converts your team&apos;s work signals
                into risk-aware status reports, approval workflows, and
                billing-ready evidence packets.&nbsp;Built for agencies and
                consultancies.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
                <Link
                  href="/auth/signup"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-md)] transition-all duration-300 hover:bg-primary-hover hover:shadow-[var(--shadow-lg)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg-elevated px-7 py-3.5 text-sm font-semibold text-text shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-border-strong hover:bg-bg-subtle hover:shadow-[var(--shadow-md)] active:scale-[0.98] sm:w-auto"
                >
                  Try Live Demo
                </Link>
              </div>

              <p className="mt-6 text-xs text-text-muted animate-fade-in" style={{ animationDelay: "500ms" }}>
                No credit card required &middot; 14-day free trial &middot; Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────── */}
        <section id="features" className="relative border-t border-border bg-bg-surface noise">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Capabilities
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Everything you need to prove your work
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
                From ingestion to invoice, ProofDesk AI covers the complete
                evidence lifecycle.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative rounded-2xl border border-border bg-bg-elevated p-6 glow-card transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-2 text-[15px] font-semibold text-text">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────── */}
        <section id="how-it-works" className="relative border-t border-border noise">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Workflow
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
                From raw signals to billing-ready evidence
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
                Seven steps. Fully automated. Completely auditable.
              </p>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-0 sm:gap-y-8">
              {steps.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div key={item.title} className="contents">
                    {/* Left column */}
                    <div className="hidden items-center justify-end sm:flex">
                      {isLeft ? (
                        <div className="pr-8 text-right">
                          <h3 className="text-[15px] font-semibold text-text">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-sm text-text-muted">
                            {item.desc}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {/* Center: step number */}
                    <div className="flex items-center gap-4 sm:flex-col sm:gap-0">
                      <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-bg-elevated text-sm font-bold text-primary shadow-[var(--shadow-sm)] transition-all duration-300 hover:scale-110 hover:border-primary/60 hover:shadow-[0_0_16px_-2px_var(--primary)]">
                        {i + 1}
                      </div>
                      {/* Mobile text */}
                      <div className="sm:hidden">
                        <h3 className="text-[15px] font-semibold text-text">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-text-muted">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="hidden items-center sm:flex">
                      {!isLeft ? (
                        <div className="pl-8">
                          <h3 className="text-[15px] font-semibold text-text">
                            {item.title}
                          </h3>
                          <p className="mt-0.5 text-sm text-text-muted">
                            {item.desc}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="relative border-t border-border bg-bg-surface noise overflow-hidden">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-3xl animate-hero-glow" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Ready to prove your work?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg">
                Join agencies and consultancies who trust ProofDesk AI to convert
                activity into evidence.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/auth/signup"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-md)] transition-all duration-300 hover:bg-primary-hover hover:shadow-[var(--shadow-lg)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg-elevated px-8 py-3.5 text-sm font-semibold text-text shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-border-strong hover:bg-bg-subtle hover:shadow-[var(--shadow-md)] active:scale-[0.98] sm:w-auto"
                >
                  Try Live Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <span className="text-[10px] font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} ProofDesk AI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
