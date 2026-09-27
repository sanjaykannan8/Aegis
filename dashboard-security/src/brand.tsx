import {
  ArrowsLeftRight,
  Crosshair,
  Desktop,
  Globe,
  type Icon,
  Plugs,
  Question,
  ShieldCheck,
} from "@phosphor-icons/react";

/** The AEGIS mark: a diagonal stroke, a vertical bar and a square, in the logo orange via currentColor. */
export function AegisMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round((size * 169) / 225)} viewBox="0 0 225 169" aria-hidden="true">
      <path d="M124 0H184L60.5 169H0Z" fill="currentColor" />
      <rect x="166" y="0" width="59" height="108" fill="currentColor" />
      <rect x="104" y="108" width="62" height="61" fill="currentColor" />
    </svg>
  );
}

export function BrandLockup() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <AegisMark size={26} />
      </span>
      <span className="brand-name">
        AEGIS <span>SOC</span>
      </span>
    </div>
  );
}

/**
 * The five entity kinds in schemas/alert.v1.schema.json. Each keys a different kind of
 * thing - a host, a service endpoint, a conversation, a domain - so each gets its own
 * glyph rather than one generic host icon.
 */
const ENTITY_ICONS: Record<string, Icon> = {
  src_host: Desktop,
  dst_host: Crosshair,
  dst_service: Plugs,
  service_pair: ArrowsLeftRight,
  src_domain: Globe,
};

export function entityIcon(kind: string): Icon {
  return ENTITY_ICONS[kind.toLowerCase()] ?? Question;
}

export { ShieldCheck };
