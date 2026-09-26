"use client";

import { IconBolt, IconCircleCheckFilled, IconLoader2, IconPlayerPlayFilled, IconRefresh } from "@tabler/icons-react";
import { useRef, useState } from "react";

import { faultChecks } from "@/lib/data";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { CountUp } from "./count-up";
import { SectionHeading, Shell, Tag } from "./primitives";
import { Reveal } from "./reveal";

type Phase = "idle" | "down" | "recovering" | "passed";

const badge: Record<Phase, { label: string; className: string }> = {
  idle: { label: "Ready", className: "bg-secondary text-ink-soft" },
  down: { label: "Fault injected", className: "bg-red-50 text-red-600" },
  recovering: { label: "Recovering", className: "bg-amber-50 text-amber-700" },
  passed: { label: "Recovered", className: "bg-emerald-50 text-emerald-700" },
};

export function Resilience() {
  const root = useRef<HTMLDivElement>(null);
  const [phases, setPhases] = useState<Phase[]>(() => faultChecks.map(() => "idle"));
  const [running, setRunning] = useState(false);

  const setPhase = (i: number, p: Phase) => setPhases((cur) => cur.map((x, k) => (k === i ? p : x)));

  const { contextSafe } = useGSAP({ scope: root });

  /** Builds the fault → recovery animation for one row; returned so "run all" can chain them. */
  const faultTimeline = contextSafe((i: number) => {
    const quick = prefersReducedMotion();
    const row = `.fault-${i}`;
    const t = gsap.timeline();
    t.call(() => setPhase(i, "down"))
      .fromTo(row, { x: 0 }, { x: 6, duration: 0.05, repeat: quick ? 0 : 7, yoyo: true, ease: "none" })
      .fromTo(`${row} .bar`, { scaleX: 0 }, { scaleX: 1, duration: quick ? 0.01 : 1.1, ease: "power2.inOut" }, "+=0.25")
      .call(() => setPhase(i, "recovering"), undefined, "<")
      .call(() => setPhase(i, "passed"))
      .fromTo(`${row} .outcome`, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE });
    return t;
  });

  const inject = contextSafe((i: number) => {
    if (running) return;
    faultTimeline(i);
  });

  const runAll = contextSafe(() => {
    if (running) return;
    setRunning(true);
    setPhases(faultChecks.map(() => "idle"));
    const master = gsap.timeline({ onComplete: () => setRunning(false) });
    faultChecks.forEach((_, i) => master.add(faultTimeline(i), i === 0 ? 0 : ">-0.2"));
  });

  const passed = phases.filter((p) => p === "passed").length;

  return (
    <section id="resilience" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div className="md:sticky md:top-28">
          <Reveal>
            <SectionHeading
              eyebrow="Resilience"
              title="We tried to break it. Seven ways."
              subtitle="Our automated suite kills servers, restarts the broker, cuts the database and storage, and feeds the link forged data. After every fault, AEGIS must recover and still catch a fresh attack. Inject them yourself."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Shell className="mt-10" innerClassName="p-7">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconRefresh className="size-4" stroke={1.75} /> Full stack down and up
                </span>
                <Tag tone="brand">Measured</Tag>
              </div>
              <p className="mt-4 text-5xl font-semibold tracking-[-0.05em] tabular-nums">
                <CountUp to={16643} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">events before the restart</p>
              <div className="my-4 h-px bg-black/[0.06]" />
              <p className="text-5xl font-semibold tracking-[-0.05em] text-brand tabular-nums">
                <CountUp to={16643} duration={2.2} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">events after, restored from checkpoint. Zero lost.</p>
            </Shell>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div ref={root}>
            <Shell innerClassName="p-2">
              <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground tabular-nums">{passed}/7</span> recovered this session
                </p>
                <button
                  type="button"
                  onClick={runAll}
                  disabled={running}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white transition-transform duration-300 ease-spring active:scale-[0.97] disabled:opacity-60"
                >
                  <IconPlayerPlayFilled className="size-3.5 text-brand" /> Run all seven
                </button>
              </div>
              <ul className="flex flex-col">
                {faultChecks.map((f, i) => {
                  const p = phases[i];
                  return (
                    <li
                      key={f.name}
                      className={cn(
                        `fault-${i} relative overflow-hidden rounded-2xl px-5 py-4 transition-colors duration-500`,
                        p === "down" && "bg-red-50/60",
                        p === "recovering" && "bg-amber-50/50",
                        p === "passed" && "bg-emerald-50/40",
                      )}
                    >
                      <span
                        className="bar pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-emerald-500/60"
                        aria-hidden
                      />
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 text-xs text-muted-foreground tabular-nums">0{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-medium text-foreground">{f.name}</p>
                          <p className="text-sm text-muted-foreground">Fault: {f.fault}</p>
                          <p className={cn("outcome mt-1 text-sm font-medium text-emerald-700", p !== "passed" && "invisible")}>
                            {f.detail}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", badge[p].className)}>
                            {p === "passed" && <IconCircleCheckFilled className="size-3.5" />}
                            {p === "recovering" && <IconLoader2 className="size-3.5 animate-spin" />}
                            {badge[p].label}
                          </span>
                          {p === "idle" && (
                            <button
                              type="button"
                              data-variant="destructive"
                              onClick={() => inject(i)}
                              className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-[0_1px_3px_rgba(17,17,19,0.1)] transition-transform duration-300 ease-spring active:scale-[0.96]"
                            >
                              <IconBolt className="size-3.5" stroke={1.75} /> Inject
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="px-5 pt-2 pb-4 text-xs text-muted-foreground">
                The replay above mirrors outcomes our automated failure suite recorded on real injected faults.
              </p>
            </Shell>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
