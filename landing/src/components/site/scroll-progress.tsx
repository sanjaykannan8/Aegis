"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/** Thin brand bar pinned to the top of the viewport that fills with page scroll (GSAP ScrollTrigger scrub). */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
      },
    );
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#ff8a3d] to-brand" />
    </div>
  );
}
