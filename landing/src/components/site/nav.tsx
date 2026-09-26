"use client";

import { IconBrandGithub } from "@tabler/icons-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SoundToggle } from "@/components/ui/sound";
import { GITHUB_URL } from "@/lib/data";

import { LogoMark } from "./primitives";

const platform = [
  { href: "#features", title: "Features", text: "Passive sensing, one-way link, explainable alerts" },
  { href: "#how", title: "How it works", text: "From mirror port to SOC in under a second" },
  { href: "#ai", title: "Detection AI", text: "Rules, in-stream ML and a language model" },
  { href: "#who", title: "IT + OT", text: "Who it protects, on both sides of the network" },
];

export function Nav() {
  return (
    <header className="sticky top-4 z-40 mx-auto flex w-[min(100%-2rem,1120px)] items-center justify-between gap-4 rounded-full bg-white/80 py-2 pr-2 pl-5 shadow-[0_1px_2px_rgba(17,17,19,0.05),0_12px_32px_-16px_rgba(17,17,19,0.22)] backdrop-blur-xl">
      <a href="#top" className="flex items-center gap-2.5" aria-label="AEGIS home">
        <LogoMark className="h-5 text-brand" />
        <span className="text-[15px] font-semibold tracking-[-0.02em]">AEGIS</span>
      </a>

      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="gap-0.5">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-ink-soft">Platform</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[420px] grid-cols-2 gap-1 p-1">
                {platform.map((item) => (
                  <li key={item.href}>
                    <NavigationMenuLink
                      href={item.href}
                      className="flex flex-col items-start gap-1 rounded-xl p-3"
                    >
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                      <span className="text-xs leading-snug text-muted-foreground">{item.text}</span>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {[
            ["#performance", "Performance"],
            ["#resilience", "Resilience"],
            ["#scale", "Scale"],
          ].map(([href, label]) => (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink href={href} className="px-3 py-1.5 font-medium text-ink-soft">
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-1.5">
        <SoundToggle className="size-9 rounded-full" />
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white transition-transform duration-300 ease-spring active:scale-[0.98]"
        >
          <IconBrandGithub className="size-4" stroke={1.75} />
          GitHub
        </a>
      </div>
    </header>
  );
}
