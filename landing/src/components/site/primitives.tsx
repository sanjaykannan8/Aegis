import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { GITHUB_URL } from "@/lib/data";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 225 169" className={cn("h-6 w-auto", className)} aria-hidden>
      <path d="M124 0H184L60.5 169H0Z" fill="currentColor" />
      <rect x="166" y="0" width="59" height="108" fill="currentColor" />
      <rect x="104" y="108" width="62" height="61" fill="currentColor" />
    </svg>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase shadow-[0_1px_3px_rgba(17,17,19,0.06)]",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-foreground md:text-5xl">{title}</h2>
      {subtitle && <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{subtitle}</p>}
    </div>
  );
}

/** Card surface: white, rounded, lifted by a soft shadow only (no outline). */
export const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(17,17,19,0.04),0_10px_30px_-12px_rgba(17,17,19,0.10)]";

export function Shell({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn("h-full", className)}>
      <div className={cn("relative h-full overflow-hidden rounded-[1.75rem] bg-white", CARD_SHADOW, innerClassName)}>
        {children}
      </div>
    </div>
  );
}

export function IconTile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#ff7a2e] to-brand text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_16px_-6px_rgba(255,98,11,0.6)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function GithubButton({ className, label = "View on GitHub" }: { className?: string; label?: string }) {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group inline-flex items-center gap-3 rounded-full bg-foreground py-1.5 pr-1.5 pl-5 text-sm font-medium text-white transition-transform duration-300 ease-spring active:scale-[0.98]",
        className,
      )}
    >
      <IconBrandGithub className="size-4" stroke={1.75} />
      {label}
      <span className="flex size-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">
        <IconArrowUpRight className="size-4" stroke={1.75} />
      </span>
    </a>
  );
}

export function GhostButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-foreground shadow-[0_1px_3px_rgba(17,17,19,0.08)] transition-[transform,box-shadow] duration-300 ease-spring hover:shadow-[0_4px_14px_-4px_rgba(17,17,19,0.14)] active:scale-[0.98]",
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "brand" | "next" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        tone === "neutral" && "bg-secondary text-ink-soft",
        tone === "brand" && "bg-brand-soft text-brand-deep",
        tone === "next" && "bg-foreground text-white",
      )}
    >
      {children}
    </span>
  );
}
