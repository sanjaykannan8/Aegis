"use client";

import { useRef } from "react";

import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Counts from 0 to `to` when scrolled into view. Renders the final value on the server. */
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const state = { v: 0 };
      el.textContent = format(0);
      gsap.to(state, {
        v: to,
        duration,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = format(state.v);
        },
      });
    },
    { scope: ref, dependencies: [to] },
  );

  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
