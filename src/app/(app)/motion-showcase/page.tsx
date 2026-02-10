"use client";

import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { registerGSAP, gsap, ScrollTrigger, fadeInUp, staggerFadeIn, prefersReducedMotion, getMotionDuration } from "@/lib/motion/gsap-config";

export default function MotionShowcasePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();

    if (heroRef.current) {
      fadeInUp(heroRef.current, { duration: 0.8, y: 32 });
    }

    if (cardsRef.current) {
      staggerFadeIn(cardsRef.current.children, { stagger: 0.12, duration: 0.6 });
    }

    if (counterRef.current && !prefersReducedMotion()) {
      gsap.fromTo(counterRef.current, { textContent: "0" }, {
        textContent: "2847",
        duration: 2,
        delay: 0.5,
        snap: { textContent: 1 },
        ease: "power2.out",
      });
    } else if (counterRef.current) {
      counterRef.current.textContent = "2847";
    }

    if (progressRef.current && !prefersReducedMotion()) {
      gsap.fromTo(progressRef.current, { width: "0%" }, {
        width: "78%",
        duration: 1.5,
        delay: 0.8,
        ease: "power2.out",
      });
    } else if (progressRef.current) {
      progressRef.current.style.width = "78%";
    }

    // ScrollTrigger demo
    if (scaleRef.current && !prefersReducedMotion()) {
      gsap.fromTo(scaleRef.current, { scale: 0.8, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: getMotionDuration(0.8),
        scrollTrigger: {
          trigger: scaleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    } else if (scaleRef.current) {
      gsap.set(scaleRef.current, { scale: 1, opacity: 1 });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="space-y-12">
      <div ref={heroRef} className="opacity-0">
        <h1 className="text-2xl font-bold text-text">Motion Showcase</h1>
        <p className="text-sm text-text-muted mt-1">
          GSAP + ScrollTrigger animations with reduced-motion support
        </p>
      </div>

      {/* Stagger Cards */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Stagger Fade-In</h2>
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Ingestion", "Timeline", "AI Summary", "Billing"].map((label, i) => (
            <Card key={label} padding="md" className="opacity-0">
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-primary">{i + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-text">{label}</h3>
                <p className="text-xs text-text-muted mt-1">Step {i + 1} of the workflow</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Counter Animation */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Counter Animation</h2>
        <Card padding="lg">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">
              <span ref={counterRef}>0</span>
            </p>
            <p className="text-sm text-text-muted mt-2">Evidence artifacts processed</p>
          </div>
        </Card>
      </section>

      {/* Progress Bar */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Animated Progress</h2>
        <Card padding="md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text">Project Completion</p>
              <p className="text-sm text-text-muted">78%</p>
            </div>
            <div className="h-3 rounded-full bg-bg-subtle overflow-hidden">
              <div ref={progressRef} className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: "0%" }} />
            </div>
          </div>
        </Card>
      </section>

      {/* ScrollTrigger */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">ScrollTrigger Scale</h2>
        <p className="text-sm text-text-muted mb-8">Scroll down to see this card animate in</p>
        <div className="h-32" aria-hidden="true" />
        <div ref={scaleRef} className="opacity-0">
          <Card padding="lg" className="bg-gradient-to-br from-primary-light to-secondary-light border-primary/20">
            <CardHeader>
              <CardTitle>Scroll-Triggered Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">
                This card scales in when it enters the viewport. Uses GSAP ScrollTrigger
                with transform/opacity for 60fps performance. Respects prefers-reduced-motion.
              </p>
              <div className="mt-4">
                <Button variant="primary">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reduced Motion Notice */}
      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-subtle p-6 text-center">
        <p className="text-sm text-text-muted">
          {prefersReducedMotion()
            ? "⚡ Reduced motion is enabled. All animations are instant."
            : "🎬 Animations are active. Enable 'Reduce motion' in your OS settings to disable."}
        </p>
      </section>
    </div>
  );
}
