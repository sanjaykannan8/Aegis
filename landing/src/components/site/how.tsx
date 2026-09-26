"use client";

import {
  IconBrain,
  IconLayoutDashboard,
  IconPlayerPlayFilled,
  IconShieldLock,
  IconStack2,
  IconTopologyStar3,
} from "@tabler/icons-react";
import { useRef, useState } from "react";

import { attacks, stack, type Attack } from "@/lib/data";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

import { CARD_SHADOW, SectionHeading, Shell, Tag } from "./primitives";
import { Reveal } from "./reveal";

const stages = [
  { icon: IconTopologyStar3, title: "Mirror port", text: "Zeek reads a copy of IT and OT traffic, with its own networking disabled.", dark: false },
  { icon: IconShieldLock, title: "One-way link", text: "Signed, sequenced UDP frames. No acknowledgement, no route back.", dark: true },
  { icon: IconStack2, title: "Receiver", text: "Signatures verified, duplicates dropped, spooled to a durable event log.", dark: false },
  { icon: IconBrain, title: "Detection", text: "Flink runs the detectors and the ONNX model with exactly-once state.", dark: false },
  { icon: IconLayoutDashboard, title: "SOC", text: "One explained incident per attack, with evidence and a timeline.", dark: false },
];

function logLines(a: Attack) {
  return [
    ["sensor", "Zeek extracted connection and DNS metadata from the mirror port"],
    ["link", "frames signed with HMAC-SHA256 and sent one way; nothing can reply"],
    ["receiver", "signatures verified, duplicates dropped, spooled to the event log"],
    ["flink", `${a.detector}: ${a.finding}`],
    ["soc", `incident opened · ${a.severity} · ${a.alertMs} ms after the evidence arrived`],
  ] as const;
}

export function How() {
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const stageRefs = useRef<(HTMLLIElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [attack, setAttack] = useState<Attack>(attacks[0]);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  const { contextSafe } = useGSAP({ scope: root });

  // Wrapped in contextSafe at call time (not during render) so the timeline is cleaned up with the component.
  const launch = (a: Attack) => contextSafe(() => play(a))();

  function play(a: Attack) {
    setAttack(a);
    setDone(false);
    setStep(-1);
    tl.current?.kill();

    const track = trackRef.current;
    const d = dot.current;
    if (!track || !d) return;
    const box = track.getBoundingClientRect();
    const points = stageRefs.current.map((el) => {
      const r = el!.getBoundingClientRect();
      return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });

    const quick = prefersReducedMotion();
    const t = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    t.set(d, { x: points[0].x - 9, y: points[0].y - 9, autoAlpha: 0, scale: 0.4 });
    t.to(d, { autoAlpha: 1, scale: 1, duration: 0.25 });
    points.forEach((p, i) => {
      if (i > 0) t.to(d, { x: p.x - 9, y: p.y - 9, duration: quick ? 0.01 : 0.55 });
      t.call(() => setStep(i));
      const el = stageRefs.current[i];
      t.fromTo(
        el,
        { scale: 1 },
        { scale: 1.035, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" },
        "<",
      );
    });
    t.to(d, { scale: 2.6, autoAlpha: 0, duration: 0.45, ease: EASE });
    t.call(() => setDone(true));
    tl.current = t;
  }

  // Play the first attack once when the section scrolls into view, so it demonstrates itself.
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: "top 60%", once: true, onEnter: () => launch(attacks[0]) });
    },
    { scope: root },
  );

  const lines = logLines(attack);

  return (
    <section id="how" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="Launch an attack. Watch it get caught."
          subtitle="Pick an attack below. It travels the same path real traffic takes, and the incident shows the latency and evidence we measured for that attack end to end."
        />
      </Reveal>

      <div ref={root} className="mt-12 flex flex-col gap-4">
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {attacks.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => launch(a)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-[transform,background-color,color,box-shadow] duration-300 ease-spring active:scale-[0.97]",
                  attack.id === a.id
                    ? "bg-foreground text-white shadow-[0_8px_20px_-8px_rgba(17,17,19,0.5)]"
                    : `bg-white text-ink-soft hover:text-foreground ${CARD_SHADOW}`,
                )}
              >
                {attack.id === a.id && <IconPlayerPlayFilled className="size-3.5 text-brand" />}
                {a.name}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <Shell innerClassName="p-5 md:p-7">
            <div className="mb-5 grid grid-cols-[1fr_auto_3fr] items-center gap-3 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              <span>Sensor side · IT + OT</span>
              <span className="rounded-full bg-foreground px-2.5 py-1 text-white">Diode</span>
              <span className="text-right">SOC side · analytics enclave</span>
            </div>
            <div ref={trackRef} className="relative">
              <ol className="grid gap-3 md:grid-cols-5">
                {stages.map((s, i) => {
                  const lit = step >= i;
                  return (
                    <li
                      key={s.title}
                      ref={(el) => {
                        stageRefs.current[i] = el;
                      }}
                      className={cn(
                        "relative flex flex-col gap-3 rounded-2xl p-5 transition-[background-color,box-shadow] duration-500",
                        s.dark
                          ? "bg-foreground text-white"
                          : lit
                            ? "bg-brand-soft shadow-[0_10px_24px_-14px_rgba(255,98,11,0.6)]"
                            : "bg-secondary/70",
                        s.dark && lit && "shadow-[0_0_0_3px_rgba(255,98,11,0.55)]",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <s.icon className="size-6 text-brand" stroke={1.5} />
                        <span className={s.dark ? "text-xs text-white/50" : "text-xs text-muted-foreground"}>0{i + 1}</span>
                      </div>
                      <p className="text-base font-semibold tracking-[-0.02em]">{s.title}</p>
                      <p className={cn("text-sm leading-relaxed", s.dark ? "text-white/70" : "text-muted-foreground")}>
                        {s.text}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <span
                ref={dot}
                aria-hidden
                className="pointer-events-none invisible absolute top-0 left-0 size-[18px] rounded-full bg-brand shadow-[0_0_0_6px_rgba(255,98,11,0.18),0_0_24px_rgba(255,98,11,0.6)]"
              />
            </div>
          </Shell>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <Shell innerClassName="bg-[#131316] p-6 font-mono text-[13px] leading-relaxed text-white/80">
              <p className="mb-3 flex items-center gap-2 text-xs text-white/40">
                <span className="size-2 rounded-full bg-emerald-400" /> live trace · {attack.name.toLowerCase()}
              </p>
              <ol className="flex flex-col gap-1.5">
                {lines.map(([who, what], i) => (
                  <li
                    key={`${attack.id}-${who}`}
                    className={cn(
                      "flex gap-3 transition-[opacity,transform] duration-500",
                      step >= i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                    )}
                  >
                    <span className="w-16 shrink-0 text-brand">{who}</span>
                    <span>{what}</span>
                  </li>
                ))}
              </ol>
            </Shell>
          </Reveal>

          <Reveal delay={0.05}>
            <Shell innerClassName="flex flex-col p-6">
              <div
                data-success={done ? "" : undefined}
                className={cn(
                  "flex h-full flex-col transition-[opacity,transform] duration-700 ease-spring",
                  done ? "translate-y-0 opacity-100" : "translate-y-2 opacity-40",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    {done ? "Incident opened" : "Waiting for evidence"}
                  </span>
                  <Tag tone={attack.severity === "High" ? "brand" : "neutral"}>{attack.severity}</Tag>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{attack.name}</p>
                <p className="text-sm text-muted-foreground">{attack.detector}</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-secondary/70 p-4">
                    <p className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">
                      {attack.alertMs}
                      <span className="ml-0.5 text-base text-muted-foreground">ms</span>
                    </p>
                    <p className="text-xs text-muted-foreground">evidence to alert</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/70 p-4">
                    <p className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">
                      {attack.evidenceS}
                      <span className="ml-0.5 text-base text-muted-foreground">s</span>
                    </p>
                    <p className="text-xs text-muted-foreground">of traffic needed</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  <span className="font-medium text-foreground">Why: </span>
                  {attack.finding}.
                </p>
                <p className="mt-auto pt-4 text-xs text-muted-foreground">Timings measured in our end-to-end run.</p>
              </div>
            </Shell>
          </Reveal>
        </div>

        <Reveal>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stack.map((t) => (
              <div key={t.name} className={`rounded-2xl bg-white px-5 py-4 ${CARD_SHADOW}`}>
                <p className="text-sm font-semibold tracking-[-0.01em]">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
