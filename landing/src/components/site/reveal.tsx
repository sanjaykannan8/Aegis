"use client";

import { useRef } from "react";

import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Fades content up once as it scrolls into view (GSAP ScrollTrigger). Skipped under reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current, {
        autoAlpha: 0,
        y: 36,
        filter: "blur(8px)",
        duration: 1.1,
        delay,
        ease: EASE,
        clearProps: "filter,transform",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
