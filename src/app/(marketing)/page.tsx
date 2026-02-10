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
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Canonical Timeline",
    description: "Automatically ingest and normalize work signals into a single source of truth.",
  },
  {
    icon: Sparkles,
    title: "AI Status Copilot",
    description: "Generate traceable status summaries with one click. Regenerate in multiple variants.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Monitor",
    description: "Detect scope creep, delivery delays, and blockers before they become problems.",
  },
  {
    icon: CheckCircle2,
    title: "Approvals Center",
    description: "Route approvals and signoffs with full audit trail and decision history.",
  },
  {
    icon: CreditCard,
    title: "Billing Packets",
    description: "Generate invoice-ready evidence bundles tied to actual work performed.",
  },
  {
    icon: Shield,
    title: "Immutable Audit",
    description: "Every action logged. Every decision traceable. Full compliance confidence.",
  },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-elevated/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-[var(--radius-lg)] bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="text-lg font-semibold text-text">ProofDesk AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-text-muted hover:text-text transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-text-muted hover:text-text transition-colors">
              How It Works
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-text hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors shadow-[var(--shadow-sm)]"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-primary/20 bg-primary-light px-3 py-1 text-xs font-medium text-primary mb-6">
                <FileCheck className="h-3.5 w-3.5" />
                AI Governance Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-[1.1]">
                Turn work activity into{" "}
                <span className="text-primary">trusted client evidence</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl">
                ProofDesk AI automatically converts your team&apos;s work signals into
                risk-aware status reports, approval workflows, and billing-ready
                evidence packets. Built for agencies and consultancies.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary-hover transition-colors shadow-[var(--shadow-md)]"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-border bg-bg-elevated px-6 py-3 text-base font-medium text-text hover:bg-bg-subtle transition-colors"
                >
                  Try Live Demo
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary-light/30 to-transparent" aria-hidden="true" />
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-text">
                Everything you need to prove your work
              </h2>
              <p className="mt-4 text-lg text-text-muted">
                From ingestion to invoice, ProofDesk AI covers the complete evidence lifecycle.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
                  >
                    <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-primary-light flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-text mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t border-border">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-text">
                How it works
              </h2>
              <p className="mt-4 text-lg text-text-muted">
                Seven steps from raw work signals to billing-ready evidence.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Connect", desc: "Ingest work signals from your tools" },
                { step: "2", title: "Normalize", desc: "Build a canonical event timeline" },
                { step: "3", title: "Summarize", desc: "AI generates traceable status reports" },
                { step: "4", title: "Monitor", desc: "Detect risks and scope creep early" },
                { step: "5", title: "Approve", desc: "Route signoffs with full audit trail" },
                { step: "6", title: "Package", desc: "Generate billing evidence packets" },
                { step: "7", title: "Audit", desc: "Immutable log of every action taken" },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-base font-semibold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Ready to prove your work?
            </h2>
            <p className="text-lg text-text-muted mb-8 max-w-xl mx-auto">
              Join agencies and consultancies who trust ProofDesk AI to convert activity into evidence.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground hover:bg-primary-hover transition-colors shadow-[var(--shadow-md)]"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-bg-elevated">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} ProofDesk AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-text-muted hover:text-text transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-text-muted hover:text-text transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
