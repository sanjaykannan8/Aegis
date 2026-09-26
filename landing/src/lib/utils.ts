import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Compose class names; later Tailwind utilities override earlier ones, so a caller's className wins. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
