/**
 * Blueprint background, after the reference: dashed vertical guides framing the content column for the full
 * page height, and dashed horizontal rules between sections with a small square where they cross the guides.
 * Purely decorative and pointer-events-none.
 */

const DASH_V = "bg-[repeating-linear-gradient(to_bottom,rgba(17,17,19,0.13)_0_5px,transparent_5px_11px)]";
const DASH_H = "bg-[repeating-linear-gradient(to_right,rgba(17,17,19,0.13)_0_5px,transparent_5px_11px)]";

/** Column edges sit 28px outside the 1120px content width (or the viewport margin on small screens). */
const EDGE_L = "left-[max(0.5rem,calc(50%-588px))]";
const EDGE_R = "right-[max(0.5rem,calc(50%-588px))]";

export function PageGuides() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className={`absolute inset-y-0 ${EDGE_L} w-px ${DASH_V}`} />
      <div className={`absolute inset-y-0 ${EDGE_R} w-px ${DASH_V}`} />
    </div>
  );
}

export function SectionRule() {
  return (
    <div aria-hidden className="pointer-events-none relative h-px w-full">
      <div className={`absolute inset-0 ${DASH_H}`} />
      <span className={`absolute top-1/2 ${EDGE_L} size-[7px] -translate-x-1/2 -translate-y-1/2 bg-[#b8b8b4]`} />
      <span className={`absolute top-1/2 ${EDGE_R} size-[7px] translate-x-1/2 -translate-y-1/2 bg-[#b8b8b4]`} />
    </div>
  );
}
