import { gsap } from "gsap";
import { type RefObject, useEffect } from "react";

/**
 * Staggers the page header and top-level cards in whenever `key` changes (a view switch, or stats arriving).
 * GSAP writes transforms through CSSOM, which the API's `style-src 'self'` CSP permits, and `clearProps` removes
 * them once the tween ends. Live updates re-render without changing `key`, so they never re-trigger it.
 */
export function useStaggerIn(ref: RefObject<HTMLElement | null>, key: unknown) {
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const targets = root.querySelectorAll(
        ":scope > .page-head, :scope > .card, :scope > .row-3 > *, :scope > .row-split > *, :scope > .row-2 > *",
      );
      if (targets.length === 0) return;
      gsap.from(targets, {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: "expo.out",
        stagger: 0.05,
        clearProps: "opacity,visibility,transform",
      });
    }, root);
    return () => ctx.revert();
  }, [ref, key]);
}
