import { IconBolt, IconCpu, IconLanguage } from "@tabler/icons-react";

import { IconTile, SectionHeading, Shell, Tag } from "./primitives";
import { Reveal } from "./reveal";

const tiers = [
  {
    icon: IconBolt,
    tier: "Tier 1",
    title: "Streaming detectors",
    text: "Seven rule and statistics detectors with bounded state: scans, floods, beaconing, DNS tunnelling, TLS metadata and exfiltration.",
    stat: "< 1 s",
    statLabel: "evidence to alert",
    tag: <Tag tone="brand">Live</Tag>,
  },
  {
    icon: IconCpu,
    tier: "Tier 2",
    title: "In-stream ML model",
    text: "A DGA classifier served with ONNX Runtime inside the stream, verified against golden vectors, with automatic fallback to rules.",
    stat: "CPU-only",
    statLabel: "no GPU needed",
    tag: <Tag tone="brand">Live</Tag>,
  },
  {
    icon: IconLanguage,
    tier: "Tier 3",
    title: "Laya language model",
    text: "For malware that builds domains from real English words, which fools entropy detectors. Only uncertain cases escalate, so the fast path stays fast.",
    stat: "Zero-shot",
    statLabel: "for unseen families",
    tag: <Tag tone="next">Next</Tag>,
  },
];

export function Ai() {
  return (
    <section id="ai" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Detection AI"
          title="Three tiers, each for the job it does best"
          subtitle="Cheap, fast checks see everything. Heavier intelligence is reserved for the cases that need it."
        />
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-[1.1fr_1fr_1fr]">
        {tiers.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08}>
            <Shell className="h-full" innerClassName="flex h-full flex-col p-7">
              <div className="flex items-center justify-between">
                <IconTile>
                  <t.icon className="size-5" stroke={1.75} />
                </IconTile>
                {t.tag}
              </div>
              <p className="mt-6 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">{t.tier}</p>
              <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em]">{t.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t.text}</p>
              <div className="mt-auto flex items-baseline gap-2 border-t border-black/[0.05] pt-5">
                <span className="text-2xl font-semibold tracking-[-0.03em]">{t.stat}</span>
                <span className="text-sm text-muted-foreground">{t.statLabel}</span>
              </div>
            </Shell>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
