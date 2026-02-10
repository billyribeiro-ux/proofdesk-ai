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
      <header className="sticky top-0 z-50 border-b border-border/40 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[var(--shadow-md)] transition-transform duration-300 group-hover:scale-110">
              <span className="text-xs font-bold text-white">P</span>
            </div>
            <span className="text-base font-semibold text-text">
              ProofDesk <span className="text-gradient">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="relative text-[13px] font-medium text-text-muted transition-colors hover:text-text after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="relative text-[13px] font-medium text-text-muted transition-colors hover:text-text after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              How It Works
            </Link>
            <div className="h-4 w-px bg-border/50" />
            <Link
              href="/auth/signin"
              className="text-[13px] font-medium text-text-muted transition-colors hover:text-text"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-[13px] font-semibold text-white shadow-[0_0_20px_-4px_var(--primary)] transition-all duration-300 hover:shadow-[0_0_30px_-2px_var(--primary)] hover:scale-[1.03] active:scale-[0.97]"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
        <section className="relative isolate overflow-hidden">
          {/* Animated gradient mesh background — 3 orbiting blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/[0.12] via-secondary/[0.06] to-transparent blur-[100px] animate-hero-glow" />
            <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/[0.08] blur-[80px] animate-hero-glow" style={{ animationDelay: "-7s" }} />
            <div className="absolute left-[-5%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[80px] animate-hero-glow" style={{ animationDelay: "-14s" }} />
            {/* Grid overlay for depth */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.03]" />
          </div>

          <div className="mx-auto max-w-6xl px-6 pb-28 pt-28 sm:pb-36 sm:pt-36 lg:pb-44 lg:pt-44">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary animate-slide-up-reveal animate-border-glow">
                <FileCheck className="h-3.5 w-3.5" />
                AI Governance Platform
              </div>

              {/* Hero heading — dramatic blur-up reveal */}
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.06] animate-slide-up-reveal" style={{ animationDelay: "100ms" }}>
                <span className="text-shimmer">Turn work activity into</span>
                <br />
                <span className="text-gradient-animated">
                  trusted client evidence
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg sm:leading-8 animate-slide-up-reveal" style={{ animationDelay: "250ms" }}>
                ProofDesk AI automatically converts your team&apos;s work signals
                into risk-aware status reports, approval workflows, and
                billing-ready evidence packets.&nbsp;Built for agencies and
                consultancies.
              </p>

              {/* CTA buttons — gradient primary, glass secondary */}
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up-reveal" style={{ animationDelay: "400ms" }}>
                <Link
                  href="/auth/signup"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_-6px_var(--primary)] transition-all duration-300 hover:shadow-[0_0_50px_-4px_var(--primary)] hover:scale-[1.03] active:scale-[0.97] sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg-elevated/80 px-8 py-4 text-sm font-semibold text-text shadow-[var(--shadow-sm)] backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-bg-subtle hover:shadow-[var(--shadow-md)] active:scale-[0.97] sm:w-auto"
                >
                  Try Live Demo
                </Link>
              </div>

              <p className="mt-8 text-xs text-text-muted/60 animate-slide-up-reveal" style={{ animationDelay: "550ms" }}>
                No credit card required &middot; 14-day free trial &middot; Cancel anytime
              </p>
            </div>
          </div>

          {/* Bottom fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" aria-hidden="true" />
        </section>

        {/* ── Features ────────────────────────────────────────── */}
        <section id="features" className="relative border-t border-border/40 bg-bg-surface noise">
          <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
            <div className="mx-auto mb-20 max-w-2xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary animate-slide-up-reveal">
                Capabilities
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl animate-slide-up-reveal" style={{ animationDelay: "100ms" }}>
                Everything you need to{" "}
                <span className="text-gradient">prove your work</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-muted sm:text-lg animate-slide-up-reveal" style={{ animationDelay: "200ms" }}>
                From ingestion to invoice, ProofDesk AI covers the complete
                evidence lifecycle.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-bg-elevated p-7 glow-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/20"
                  >
                    {/* Hover gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_24px_-4px_var(--primary)] group-hover:ring-primary/30">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mb-2 text-base font-semibold text-text">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────── */}
        <section id="how-it-works" className="relative border-t border-border/40 noise">
          <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
            <div className="mx-auto mb-20 max-w-2xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary animate-slide-up-reveal">
                Workflow
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl animate-slide-up-reveal" style={{ animationDelay: "100ms" }}>
                From raw signals to{" "}
                <span className="text-gradient">billing-ready evidence</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-muted sm:text-lg animate-slide-up-reveal" style={{ animationDelay: "200ms" }}>
                Seven steps. Fully automated. Completely auditable.
              </p>
            </div>

            {/* Horizontal step flow on desktop, vertical on mobile */}
            <div className="relative mx-auto max-w-4xl">
              {/* Desktop: horizontal connector */}
              <div className="hidden sm:block absolute top-6 left-[calc(100%/14)] right-[calc(100%/14)] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

              <div className="grid grid-cols-1 sm:grid-cols-7 gap-8 sm:gap-3">
                {steps.map((item, i) => (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Step circle */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-bg-elevated text-sm font-bold text-primary shadow-[var(--shadow-md)] transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_30px_-4px_var(--primary)] group-hover:bg-primary group-hover:text-white">
                      {i + 1}
                    </div>
                    {/* Label */}
                    <div className="sm:mt-4">
                      <h3 className="text-sm font-semibold text-text transition-colors duration-300 group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-text-muted">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="relative border-t border-border/40 overflow-hidden">
          {/* Dramatic background — dual glow blobs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-[700px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/[0.08] to-secondary/[0.04] blur-[100px] animate-hero-glow" />
            <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-secondary/[0.06] blur-[80px] animate-breathe" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.02]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl animate-slide-up-reveal">
                Ready to{" "}
                <span className="text-gradient-animated">prove your work</span>?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-text-muted sm:text-lg animate-slide-up-reveal" style={{ animationDelay: "100ms" }}>
                Join agencies and consultancies who trust ProofDesk AI to convert
                activity into evidence.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up-reveal" style={{ animationDelay: "250ms" }}>
                <Link
                  href="/auth/signup"
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-sm font-semibold text-white shadow-[0_0_40px_-8px_var(--primary)] transition-all duration-300 hover:shadow-[0_0_60px_-4px_var(--primary)] hover:scale-[1.03] active:scale-[0.97] sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-bg-elevated/80 px-8 py-4 text-sm font-semibold text-text shadow-[var(--shadow-sm)] backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-bg-subtle hover:shadow-[var(--shadow-md)] active:scale-[0.97] sm:w-auto"
                >
                  Try Live Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary shadow-[var(--shadow-sm)]">
              <span className="text-[10px] font-bold text-white">P</span>
            </div>
            <span className="text-sm text-text-muted/60">
              &copy; {new Date().getFullYear()} ProofDesk AI. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-text-muted/60 transition-colors duration-200 hover:text-text"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted/60 transition-colors duration-200 hover:text-text"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted/60 transition-colors duration-200 hover:text-text"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
