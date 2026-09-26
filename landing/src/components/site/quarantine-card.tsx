"use client";

import { IconCircleDotted, IconPointFilled, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Reason codes the receiver actually emits when it quarantines link frames (ingest/receiver). */
const blocked = [
  { what: "Forged signature", code: "frame_hmac_invalid", seq: "seq 18,204" },
  { what: "Broken JSON record", code: "json_parse_error", seq: "seq 18,211" },
  { what: "Schema violation", code: "schema_violation", seq: "seq 18,236" },
  { what: "Unknown schema version", code: "unsupported_schema_version", seq: "seq 18,240" },
];

/**
 * Adapted from the FraudCard pattern: a beam runs down a circuit line and the quarantined frames resolve from blur.
 * Plays once when scrolled into view (touch screens cannot hover), then again on hover or tap.
 */
export function QuarantineCard({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const quick = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true, defaults: { duration: quick ? 0.01 : 0.35, ease: "power2.out" } })
        .fromTo(".q-icon", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, stagger: 0.08 }, 0.15)
        .fromTo(".q-what", { autoAlpha: 0, y: 5, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.08 }, 0.15)
        .fromTo(".q-meta", { autoAlpha: 0, y: 10, filter: "blur(5px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.08 }, 0.2);

      if (!quick) gsap.to(".q-spin", { rotate: 360, duration: 2.5, ease: "none", repeat: -1 });

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        once: true,
        onEnter: () => setOpen(true),
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (open) tl.current?.play();
      else tl.current?.reverse();
    },
    { dependencies: [open], scope: root },
  );

  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div
      ref={root}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      data-open={open}
      className={cn(
        "qbeam-container group relative flex h-full min-h-[34rem] cursor-pointer flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1px_2px_rgba(17,17,19,0.04),0_10px_30px_-12px_rgba(17,17,19,0.10)]",
        className,
      )}
    >
      <div className="flex flex-col gap-2 px-7 pt-7">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">Forged frames quarantined</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Every frame crossing the link is signed and schema-checked. Anything forged or malformed is set aside with a
          reason code before it can reach the SOC.
        </p>
      </div>

      <div className="relative mx-auto flex h-full w-[min(19rem,100%-2rem)] flex-1 flex-col">
        <div className="mt-7 py-3">
          <div className="relative z-10 rounded-[10px] bg-white p-0.5 shadow-[0_6px_18px_-8px_rgba(17,17,19,0.25)]">
            <div className="flex items-center justify-between gap-3 rounded-[8px] bg-secondary p-3">
              <div className="flex items-center gap-3">
                <IconCircleDotted className="q-spin size-4 text-brand" stroke={1.75} />
                <p className="font-mono text-[11px] text-ink-soft transition-colors duration-300 group-hover:text-foreground">
                  Hostile frames detected on link
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground tabular-nums">{time}</p>
            </div>
          </div>
        </div>

        {/* Circuit line with a travelling red beam, as in the reference. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full text-black/25"
          viewBox="0 0 52 50"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M 3.7 0 v 5.8 l 6.7 5.9 v 60" stroke="currentColor" strokeWidth="0.1" />
          <g mask="url(#qbeam-mask)">
            <circle className="qbeam" cx="0" cy="0" r="12" fill="url(#qbeam-grad)" />
          </g>
          <defs>
            <mask id="qbeam-mask">
              <path d="M 3.7 0 v 5.8 l 6.7 5.9 v 60" stroke="white" strokeWidth="0.15" />
            </mask>
            <radialGradient id="qbeam-grad" fx="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
        </svg>

        <ul className="relative mt-8 ml-[3.25rem] flex flex-col gap-7">
          {blocked.map((b) => (
            <li key={b.code} className="flex items-start gap-3">
              <span className="relative mt-0.5 size-6 shrink-0">
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/[0.07]">
                  <IconPointFilled className="size-3 text-black/30" />
                </span>
                <span className="q-icon invisible absolute inset-0 flex items-center justify-center rounded-full bg-red-500">
                  <IconX className="size-3.5 text-white" stroke={2.5} />
                </span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="q-what invisible text-[13px] font-semibold text-foreground">{b.what}</span>
                <span className="q-meta invisible font-mono text-[10.5px] text-muted-foreground">
                  {b.code} · {b.seq}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="px-7 pb-6 text-xs text-muted-foreground">
        {open ? "Every one counted and kept for forensics." : "Hover or tap to reveal."}
      </p>
    </div>
  );
}

