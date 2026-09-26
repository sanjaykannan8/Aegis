"use client";

import { HalftoneDots } from "@/components/ui/halftone-dots";

import { CountUp } from "./count-up";
import { CARD_SHADOW, Eyebrow, GhostButton, GithubButton, Shell } from "./primitives";
import { Reveal } from "./reveal";

const stats = [
  { to: 8, suffix: "/8", label: "attacks detected against ground truth" },
  { to: 586, suffix: " ms", label: "median time from evidence to alert" },
  { to: 7, suffix: "/7", label: "fault-injection tests survived" },
  { to: 0, suffix: "", label: "records lost across restarts" },
];

export function Hero() {
  return (
    <section id="top" className="mx-auto w-[min(100%-2rem,1120px)] pt-12 pb-20 md:pt-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="flex flex-col items-start gap-7">
          <Eyebrow>Passive IT + OT threat detection</Eyebrow>
          <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.045em] text-foreground md:text-7xl">
            See everything.
            <br />
            <span className="text-brand">Expose nothing.</span>
          </h1>
          <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
            AEGIS watches office networks and industrial control systems from a mirror port, sends what it sees
            across a one-way link that cannot carry anything back, and turns traffic into explained incidents in
            under a second.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <GithubButton />
            <GhostButton href="#how">Launch a live attack</GhostButton>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Shell innerClassName="bg-[#fffaf6]">
            <HalftoneDots
              src="/logo-halftone.svg"
              accent="#ff620b"
              gradient={["#ff8a3d", "#ff620b"]}
              className="h-[340px] w-full text-[#fffaf6] md:h-[420px]"
            />
            <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 text-xs shadow-[0_4px_16px_-6px_rgba(17,17,19,0.15)] backdrop-blur">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Link healthy · one-way
              </span>
              <span className="text-muted-foreground">Move your cursor over the mark</span>
            </div>
          </Shell>
        </Reveal>
      </div>

      <Reveal delay={0.25} className="mt-16">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`flex flex-col gap-1.5 rounded-[1.5rem] bg-white px-6 py-6 ${CARD_SHADOW}`}>
              <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
              <dd className="order-1 text-4xl font-semibold tracking-[-0.04em] text-foreground tabular-nums">
                <CountUp to={s.to} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
