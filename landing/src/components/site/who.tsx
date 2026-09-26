import { IconBuildingFactory2, IconDeviceDesktop, IconShieldHalfFilled } from "@tabler/icons-react";

import { SectionHeading, Shell } from "./primitives";
import { Reveal } from "./reveal";

const it = [
  ["Banks, UPI & fintech", "data theft and malware call-backs flagged in under a second"],
  ["e-Governance", "sovereign, offline monitoring; citizen data never leaves"],
  ["Hospitals", "early ransomware signals: beaconing and DNS tunnels"],
  ["Data centres & telecom", "DDoS, scans and encrypted threats, no decryption"],
  ["Universities & MSMEs", "a full SOC with zero licence cost"],
];
const ot = [
  ["Power grids & utilities", "passive monitoring that never touches control systems"],
  ["Water & sewage", "full OT visibility without touching a PLC"],
  ["Railways & metro", "signalling and operations watched with zero risk"],
  ["Oil, gas & ports", "runs fully offline inside air-gapped sites"],
  ["Industry 4.0 plants", "IT-grade security for machines and lines"],
];

function World({ icon: Icon, title, sub, rows }: { icon: typeof IconDeviceDesktop; title: string; sub: string; rows: string[][] }) {
  return (
    <Shell className="h-full" innerClassName="p-7">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground">
          <Icon className="size-5" stroke={1.5} />
        </span>
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
          <p className="text-sm text-muted-foreground">{sub}</p>
        </div>
      </div>
      <ul className="mt-6 flex flex-col">
        {rows.map(([who, what]) => (
          <li key={who} className="flex flex-col gap-0.5 border-t border-black/[0.05] py-3">
            <span className="text-[15px] font-medium text-foreground">{who}</span>
            <span className="text-sm text-muted-foreground">{what}</span>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function Who() {
  return (
    <section id="who" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="IT + OT"
          title="One attack can move from a laptop to a power grid"
          subtitle="Attackers break into office IT, then pivot into the systems that run the physical world. AEGIS watches both sides in one timeline."
        />
      </Reveal>
      <div className="mt-12 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        <Reveal>
          <World icon={IconDeviceDesktop} title="IT world" sub="Offices, servers, cloud, endpoints" rows={it} />
        </Reveal>
        <Reveal delay={0.08} className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-foreground px-6 py-8 text-center text-white">
            <IconShieldHalfFilled className="size-8 text-brand" stroke={1.5} />
            <p className="text-lg font-semibold tracking-[-0.02em]">AEGIS</p>
            <p className="max-w-[12ch] text-xs leading-relaxed text-white/60">One shield, one timeline, both worlds</p>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <World icon={IconBuildingFactory2} title="OT world" sub="PLCs, SCADA, ICS, field devices" rows={ot} />
        </Reveal>
      </div>
    </section>
  );
}
