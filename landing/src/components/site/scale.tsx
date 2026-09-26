"use client";

import { IconArrowsSplit2, IconCpu2, IconStack3 } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { measuredNode, projection } from "@/lib/data";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { SectionHeading, Shell, Tag } from "./primitives";
import { Reveal } from "./reveal";

const config = { eps: { label: "Events / second", color: "var(--chart-1)" } } satisfies ChartConfig;

const compact = (n: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

const levers = [
  { icon: IconArrowsSplit2, title: "Shard per sensor", text: "Each sensor gets its own link and receiver, so one site never limits another." },
  { icon: IconCpu2, title: "Add Flink workers", text: "Detection state is keyed by entity and spreads across workers without redesign." },
  { icon: IconStack3, title: "Add partitions", text: "The event log and analytics store scale out on the same engines large SOCs run." },
];

/** Tweens a number between values instead of snapping, so moving the slider feels physical. */
function Tweened({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useRef({ v: value });
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        state.current.v = value;
        el.textContent = format(value);
        return;
      }
      gsap.to(state.current, {
        v: value,
        duration: 0.7,
        ease: EASE,
        overwrite: true,
        onUpdate: () => {
          el.textContent = format(state.current.v);
        },
      });
    },
    { dependencies: [value] },
  );
  return <span ref={ref}>{format(value)}</span>;
}

export function Scale() {
  const [idx, setIdx] = useState(4);
  const point = projection[idx];
  const perDay = point.eps * 86_400;

  return (
    <section id="scale" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Built to scale"
          title="From one plant to a national grid"
          subtitle="Every layer scales horizontally. Adding capacity means adding nodes, not rewriting the system. Drag the slider."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-8">
          <Shell innerClassName="flex h-full flex-col p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em]">Throughput as shards are added</h3>
                <p className="text-sm text-muted-foreground">Events per second across the platform</p>
              </div>
              <Tag tone="next">Projected</Tag>
            </div>
            <ChartContainer config={config} className="mt-6 aspect-auto h-[280px] w-full">
              <AreaChart data={projection} margin={{ top: 14, right: 16 }}>
                <defs>
                  <linearGradient id="fillEps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-eps)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-eps)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="shards" tickLine={false} axisLine={false} tickFormatter={(v) => `${v}×`} />
                <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={compact} />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => `${v} shards`} indicator="line" />} />
                <Area
                  dataKey="eps"
                  type="monotone"
                  stroke="var(--color-eps)"
                  strokeWidth={2.5}
                  fill="url(#fillEps)"
                  dot={{ r: 3, fill: "var(--color-eps)", strokeWidth: 0 }}
                  animationDuration={900}
                />
                <ReferenceDot x={point.shards} y={point.eps} r={8} fill="#ff620b" stroke="#fff" strokeWidth={3} />
              </AreaChart>
            </ChartContainer>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium whitespace-nowrap text-foreground tabular-nums">
                {point.shards} shard{point.shards === "1" ? "" : "s"}
              </span>
              <input
                type="range"
                min={0}
                max={projection.length - 1}
                step={1}
                value={idx}
                onChange={(e) => setIdx(Number(e.target.value))}
                aria-label="Number of shards"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-brand [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(255,98,11,0.5)]"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Extends the measured single-node ceiling of {measuredNode.acceptedEps} events per second, where the
              detection engine still had spare capacity, along per-sensor sharding.
            </p>
          </Shell>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-4 md:col-span-4">
          <Shell innerClassName="p-7">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">At {point.shards} shards</p>
              <Tag tone="next">Projected</Tag>
            </div>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] tabular-nums">
              <Tweened value={point.eps} format={compact} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">events per second</p>
          </Shell>
          <Shell innerClassName="p-7">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">Per day</p>
              <Tag tone="next">Projected</Tag>
            </div>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] tabular-nums">
              <Tweened value={perDay} format={compact} />
            </p>
            <p className="mt-1 text-sm text-muted-foreground">network events analysed daily</p>
          </Shell>
        </Reveal>

        {levers.map((l, i) => (
          <Reveal key={l.title} delay={i * 0.06} className="md:col-span-4">
            <Shell innerClassName="p-6">
              <l.icon className="size-6 text-brand" stroke={1.5} />
              <p className="mt-4 text-base font-semibold tracking-[-0.02em]">{l.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{l.text}</p>
            </Shell>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
