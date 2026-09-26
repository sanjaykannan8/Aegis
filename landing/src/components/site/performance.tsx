"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { alertLatency, evidenceWindow, loadLatency, measuredNode } from "@/lib/data";

import { SectionHeading, Shell, Tag } from "./primitives";
import { Reveal } from "./reveal";

const latencyConfig = { ms: { label: "Time to alert (ms)", color: "var(--chart-1)" } } satisfies ChartConfig;
const loadConfig = {
  p50: { label: "p50", color: "var(--chart-2)" },
  p95: { label: "p95", color: "var(--chart-1)" },
  p99: { label: "p99", color: "var(--chart-3)" },
} satisfies ChartConfig;
const evidenceConfig = { s: { label: "Evidence needed (s)", color: "var(--chart-3)" } } satisfies ChartConfig;

function ChartCard({
  title,
  subtitle,
  tag,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  tag?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Shell className="h-full" innerClassName="flex h-full flex-col p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {tag}
      </div>
      <div className="mt-6 flex-1">{children}</div>
      {footer && <div className="mt-4 border-t border-black/[0.05] pt-4 text-sm text-muted-foreground">{footer}</div>}
    </Shell>
  );
}

export function Performance() {
  return (
    <section id="performance" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Performance"
          title="Measured, not promised"
          subtitle="Ten attack scenarios replayed end to end through Zeek, the one-way link and the detection engine, then checked against ground truth. Every number below is reproducible with one command."
        />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <ChartCard
            title="Time to alert, per attack"
            subtitle="Deciding evidence received to incident written"
            tag={<Tag tone="brand">Measured</Tag>}
            footer={
              <>
                All <span className="font-medium text-foreground">8 of 8</span> attack episodes detected, and zero
                alerts on benign traffic.
              </>
            }
          >
            <ChartContainer config={latencyConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={alertLatency} layout="vertical" margin={{ left: 8, right: 44 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" dataKey="ms" hide domain={[0, 900]} />
                <YAxis type="category" dataKey="attack" tickLine={false} axisLine={false} width={112} />
                <ChartTooltip cursor={{ fill: "rgba(255,98,11,0.06)" }} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="ms" fill="var(--color-ms)" radius={8} barSize={18}>
                  <LabelList dataKey="ms" position="right" className="fill-foreground text-xs font-medium" formatter={(v) => `${v} ms`} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-4 md:col-span-5">
          <Shell innerClassName="p-7">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">Detection engine backpressure</p>
              <Tag tone="brand">Measured</Tag>
            </div>
            <p className="mt-3 text-6xl font-semibold tracking-[-0.05em] tabular-nums">
              {measuredNode.backpressureMs}
              <span className="ml-1 text-2xl text-muted-foreground">ms/s</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              At every load tested, up to ten times the lossless rate. The analytics tier never fell behind.
            </p>
          </Shell>
          <Shell innerClassName="p-7">
            <p className="text-sm text-muted-foreground">Lossless on a single laptop-class machine</p>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] tabular-nums">
              8.6M<span className="ml-1 text-xl text-muted-foreground">events / day</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {measuredNode.losslessEps} events per second, every record stored exactly once, on one host running the
              entire stack.
            </p>
          </Shell>
        </Reveal>

        <Reveal className="md:col-span-6">
          <ChartCard
            title="Detection latency under load"
            subtitle="Sustained open-loop traffic, percentiles in ms"
            tag={<Tag tone="brand">Measured</Tag>}
            footer={
              <>
                p99 stays under <span className="font-medium text-foreground">1.9 s</span> even at ten times the
                lossless rate.
              </>
            }
          >
            <ChartContainer config={loadConfig} className="aspect-auto h-[260px] w-full">
              <BarChart data={loadLatency} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="rate" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => `${v}`} />
                <ChartTooltip cursor={{ fill: "rgba(17,17,19,0.04)" }} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="p50" fill="var(--color-p50)" radius={6} />
                <Bar dataKey="p95" fill="var(--color-p95)" radius={6} />
                <Bar dataKey="p99" fill="var(--color-p99)" radius={6} />
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-6">
          <ChartCard
            title="Evidence each detector waits for"
            subtitle="Attack onset to alert, in seconds of traffic"
            tag={<Tag>By design</Tag>}
            footer="Floods are flagged in milliseconds; slow patterns like exfiltration wait for enough evidence rather than guess."
          >
            <ChartContainer config={evidenceConfig} className="aspect-auto h-[260px] w-full">
              <BarChart data={evidenceWindow} layout="vertical" margin={{ left: 8, right: 44 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" dataKey="s" hide />
                <YAxis type="category" dataKey="attack" tickLine={false} axisLine={false} width={112} />
                <ChartTooltip cursor={{ fill: "rgba(17,17,19,0.04)" }} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="s" fill="var(--color-s)" radius={8} barSize={16}>
                  <LabelList dataKey="s" position="right" className="fill-foreground text-xs font-medium" formatter={(v) => `${v} s`} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </ChartCard>
        </Reveal>
      </div>
    </section>
  );
}
