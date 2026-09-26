"use client";

import {
  IconBuildingFactory2,
  IconCircleCheck,
  IconEyeOff,
  IconLock,
  IconPlugConnectedX,
  IconRadar2,
  IconServer2,
  IconShieldCheck,
  IconWifiOff,
} from "@tabler/icons-react";
import { memo, useEffect, useRef, useState } from "react";

import { detectors } from "@/lib/data";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

import { IconTile, SectionHeading, Shell, Tag } from "./primitives";
import { QuarantineCard } from "./quarantine-card";
import { Reveal } from "./reveal";

/**
 * Packets stream left to right through the diode. "Try to send data back" fires a packet from the SOC that
 * bounces off the wall, which is the whole point of a one-way link.
 */
const DiodeFlow = memo(function DiodeFlow() {
  const root = useRef<HTMLDivElement>(null);
  const [blocked, setBlocked] = useState(0);

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".pkt").forEach((el, i) => {
        gsap.fromTo(
          el,
          { left: "-4%" },
          { left: "104%", duration: 2.6, ease: "none", repeat: -1, delay: i * 0.65 },
        );
      });
    },
    { scope: root },
  );

  const sendBack = contextSafe(() => {
    const t = gsap.timeline();
    t.set(".back", { left: "100%", autoAlpha: 1, scale: 1 })
      .to(".back", { left: "52%", duration: 0.55, ease: "power2.in" })
      .to(".wall", { x: 4, duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, ">-0.02")
      .to(".back", { left: "78%", duration: 0.45, ease: EASE }, "<")
      .to(".back", { autoAlpha: 0, scale: 0.3, duration: 0.3 }, ">-0.15")
      .fromTo(".blocked", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3 }, "<-0.2")
      .to(".blocked", { autoAlpha: 0, duration: 0.4, delay: 1.6 });
    setBlocked((n) => n + 1);
  });

  return (
    <div ref={root}>
      <div className="relative mt-6 flex items-center gap-3">
        <div className="flex shrink-0 flex-col gap-2">
          {["IT segment", "OT segment"].map((s) => (
            <span key={s} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-ink-soft">
              {s}
            </span>
          ))}
        </div>
        <div className="relative h-16 flex-1 overflow-hidden rounded-xl bg-[repeating-linear-gradient(90deg,#f4f4f3_0_10px,#fbfbfa_10px_20px)]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="pkt absolute top-1/2 left-[-4%] size-2.5 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_0_4px_rgba(255,98,11,0.12)]"
            />
          ))}
          <span className="back invisible absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.18)]" />
          <div className="wall absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 rounded-full bg-foreground/85" />
          <span className="absolute top-1.5 left-1/2 ml-2.5 text-[10px] font-semibold tracking-wider text-foreground uppercase">
            Diode
          </span>
          <span className="blocked invisible absolute right-3 bottom-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
            Blocked: no return path exists
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span className="rounded-lg bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand-deep">SOC</span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <IconPlugConnectedX className="size-3" stroke={1.75} /> no way back
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          data-sound="blocked"
          onClick={sendBack}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white transition-transform duration-300 ease-spring active:scale-[0.97]"
        >
          Try to send data back
        </button>
        <span className="text-sm text-muted-foreground tabular-nums">
          {blocked === 0 ? "Go on, try it." : `${blocked} attempt${blocked > 1 ? "s" : ""} blocked, 0 got through`}
        </span>
      </div>
    </div>
  );
});

/** Detector list that keeps re-prioritising, like a live queue. */
const DetectorQueue = memo(function DetectorQueue() {
  const root = useRef<HTMLUListElement>(null);
  const [items, setItems] = useState(detectors.slice(0, 6));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let k = 6;
    const t = setInterval(() => {
      // The newest finding moves to the top; if that detector is already listed, it is moved rather than
      // duplicated, which keeps every row (and its React key) unique.
      const next = detectors[k++ % detectors.length];
      setItems((cur) => [next, ...cur.filter((d) => d !== next)].slice(0, 6));
    }, 1800);
    return () => clearInterval(t);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".row-0", { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE });
      gsap.fromTo(".row-rest", { y: -8 }, { y: 0, duration: 0.6, ease: EASE, stagger: 0.04 });
    },
    { scope: root, dependencies: [items], revertOnUpdate: true },
  );

  return (
    <ul ref={root} className="mt-5 flex flex-col gap-2">
      {items.map((d, i) => (
        <li
          key={d}
          className={`${i === 0 ? "row-0" : "row-rest"} flex items-center justify-between rounded-xl bg-secondary/70 px-3.5 py-2.5 text-sm`}
        >
          <span className="flex items-center gap-2.5 font-medium text-foreground">
            <span className={i === 0 ? "size-2 rounded-full bg-brand" : "size-2 rounded-full bg-black/15"} />
            {d}
          </span>
          <span className="text-xs text-muted-foreground">{i === 0 ? "just now" : "watching"}</span>
        </li>
      ))}
    </ul>
  );
});

function Evidence({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.05] py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={muted ? "text-muted-foreground italic" : "font-medium text-foreground tabular-nums"}>{v}</span>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="mx-auto w-[min(100%-2rem,1120px)] py-24">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Features"
          title="Security that can never become the way in"
          subtitle="Most tools connect to the network they protect. AEGIS only listens, and it listens across a link that physically cannot answer back."
        />
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-[auto_auto]">
        {/* Passive by architecture */}
        <Reveal className="md:col-span-4 md:row-span-2">
          <Shell className="h-full" innerClassName="flex flex-col">
            <div className="flex flex-1 flex-col p-7">
              <IconTile>
                <IconEyeOff className="size-5" stroke={1.75} />
              </IconTile>
              <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">Passive by architecture</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Reads a mirror copy of traffic and never sends a packet to a device. It cannot crash a PLC or slow a
                production server, and there is no setting that makes it active.
              </p>
              <div className="mt-auto pt-8">
                <div className="flex flex-col gap-2 text-sm">
                  {["No scanning or probing", "No agents on endpoints", "No inline blocking"].map((x) => (
                    <span key={x} className="flex items-center gap-2 text-ink-soft">
                      <IconCircleCheck className="size-4 text-brand" stroke={1.75} /> {x}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-black/[0.05] px-7 py-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                <IconLock className="size-4 text-brand" stroke={1.75} /> Mode: passive
              </span>
              <span className="relative h-6 w-11 rounded-full bg-brand-soft">
                <span className="absolute top-1 right-1 size-4 rounded-full bg-brand" />
              </span>
            </div>
          </Shell>
        </Reveal>

        {/* Sensors */}
        <Reveal delay={0.05} className="md:col-span-4">
          <Shell className="h-full" innerClassName="flex h-full items-center justify-between gap-4 p-6">
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">Sensors connected</h3>
              <p className="text-sm text-muted-foreground">IT and OT segments, one view</p>
            </div>
            <div className="flex -space-x-2">
              {[IconServer2, IconBuildingFactory2, IconRadar2].map((I, n) => (
                <span
                  key={n}
                  className="flex size-10 items-center justify-center rounded-full bg-white text-brand ring-2 ring-brand-soft"
                >
                  <I className="size-4" stroke={1.75} />
                </span>
              ))}
            </div>
          </Shell>
        </Reveal>

        {/* Zero packets */}
        <Reveal delay={0.1} className="md:col-span-4 md:row-span-2">
          <Shell className="h-full" innerClassName="flex flex-col p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,98,11,0.18)_1px,transparent_1.5px)] [background-size:14px_14px] [mask-image:linear-gradient(200deg,black,transparent_60%)]" />
            <span className="relative text-[7.5rem] leading-none font-semibold tracking-[-0.06em] text-foreground">0</span>
            <div className="relative mt-auto">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">Packets sent to your network</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                Zeek runs with networking disabled entirely, and the sensor side has no route to the SOC. Even a
                compromised sensor has nowhere to go.
              </p>
            </div>
          </Shell>
        </Reveal>

        {/* Alert latency */}
        <Reveal delay={0.15} className="md:col-span-4">
          <Shell className="h-full" innerClassName="flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em]">Time to alert</h3>
                <p className="text-sm text-muted-foreground">Evidence in, incident out</p>
              </div>
              <Tag tone="brand">Median</Tag>
            </div>
            <p className="mt-5 text-6xl font-semibold tracking-[-0.05em] tabular-nums">
              586<span className="ml-1 text-2xl text-muted-foreground">ms</span>
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slowest attack class</span>
              <span className="font-medium">823 ms</span>
            </div>
          </Shell>
        </Reveal>

        {/* One-way diode */}
        <Reveal className="md:col-span-8">
          <Shell innerClassName="p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">A software data diode</h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  Every frame is HMAC-SHA256 signed, sequence-numbered and sent one way over UDP. Lost frames are
                  counted, forged ones are quarantined, and nothing ever travels back.
                </p>
              </div>
              <Tag>HMAC-SHA256</Tag>
            </div>
            <DiodeFlow />
          </Shell>
        </Reveal>

        {/* Explainable alert */}
        <Reveal delay={0.05} className="md:col-span-4">
          <Shell innerClassName="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-[-0.02em]">Every alert explains itself</h3>
            </div>
            <div className="mt-4 rounded-2xl bg-[#f7f7f6] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">Example: horizontal scan</span>
                <Tag tone="brand">High</Tag>
              </div>
              <Evidence k="Distinct hosts, one port" v="64" />
              <Evidence k="Threshold (30 s window)" v="20" />
              <Evidence k="Failed ratio" v="unavailable" muted />
              <Evidence k="Confidence" v="heuristic score" muted />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Shows what it could not see, and abstains instead of guessing.
            </p>
          </Shell>
        </Reveal>

        {/* Detectors */}
        <Reveal className="md:col-span-4">
          <Shell innerClassName="p-7">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">Seven streaming detectors</h3>
                <p className="text-sm text-muted-foreground">Ten attack patterns, deduplicated into incidents</p>
              </div>
              <Tag tone="brand">Live</Tag>
            </div>
            <DetectorQueue />
          </Shell>
        </Reveal>

        {/* Quarantine */}
        <Reveal delay={0.05} className="md:col-span-4">
          <QuarantineCard />
        </Reveal>

        {/* No decryption + offline, stacked */}
        <Reveal delay={0.1} className="flex flex-col gap-4 md:col-span-4">
          <Shell innerClassName="flex flex-col p-7">
            <IconTile>
              <IconShieldCheck className="size-5" stroke={1.75} />
            </IconTile>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Sees into encrypted traffic, without decrypting</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Suspicious TLS sessions are flagged from handshake metadata alone. No keys, no payloads, no privacy
              trade-off.
            </p>
          </Shell>
          <Shell innerClassName="flex flex-col p-7">
            <div className="flex items-center justify-between">
              <IconTile>
                <IconWifiOff className="size-5" stroke={1.75} />
              </IconTile>
              <Tag>Air-gap ready</Tag>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">Runs fully offline</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              One-command deploy from an offline bundle. No cloud, no foreign dependency, no data leaving the site.
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
              {[
                ["100%", "open source"],
                ["₹0", "licence cost"],
              ].map(([a, b]) => (
                <div key={b} className="rounded-xl bg-secondary/70 px-3 py-2.5">
                  <p className="text-lg font-semibold tracking-[-0.03em]">{a}</p>
                  <p className="text-xs text-muted-foreground">{b}</p>
                </div>
              ))}
            </div>
          </Shell>
        </Reveal>
      </div>
    </section>
  );
}
