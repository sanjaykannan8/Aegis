"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once, on the client only. Components import gsap/useGSAP from here so registration always runs first.
gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Spring-like ease used across the page; mirrors --ease-spring in globals.css. */
export const EASE = "expo.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, useGSAP };
