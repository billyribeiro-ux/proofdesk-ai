"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGSAP() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getMotionDuration(base: number): number {
  return prefersReducedMotion() ? 0 : base;
}

export function fadeInUp(
  element: gsap.TweenTarget,
  options?: { delay?: number; duration?: number; y?: number }
) {
  const duration = getMotionDuration(options?.duration ?? 0.6);
  if (duration === 0) {
    gsap.set(element, { opacity: 1, y: 0 });
    return;
  }
  return gsap.fromTo(
    element,
    { opacity: 0, y: options?.y ?? 24 },
    {
      opacity: 1,
      y: 0,
      duration,
      delay: options?.delay ?? 0,
      ease: "power2.out",
    }
  );
}

export function staggerFadeIn(
  elements: gsap.TweenTarget,
  options?: { stagger?: number; duration?: number; y?: number }
) {
  const duration = getMotionDuration(options?.duration ?? 0.5);
  if (duration === 0) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }
  return gsap.fromTo(
    elements,
    { opacity: 0, y: options?.y ?? 16 },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: options?.stagger ?? 0.08,
      ease: "power2.out",
    }
  );
}

export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export { gsap, ScrollTrigger };
