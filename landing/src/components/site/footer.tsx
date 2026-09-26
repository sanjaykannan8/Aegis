import { DOCS_URL, GITHUB_URL, TEAM } from "@/lib/data";

import { GhostButton, GithubButton, LogoMark, Shell } from "./primitives";
import { Reveal } from "./reveal";

export function Closing() {
  return (
    <section className="mx-auto w-[min(100%-2rem,1120px)] py-20">
      <Reveal>
        <Shell innerClassName="relative px-8 py-16 text-center md:px-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,98,11,0.16)_1px,transparent_1.5px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-6">
            <LogoMark className="h-10 text-brand" />
            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Attackers need one way in. We made sure there isn&apos;t one.
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground">
              The full source, the measured results and the one-command verification suite are open for anyone to
              run.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GithubButton label="Explore the project" />
              <GhostButton href={DOCS_URL}>Read the evidence</GhostButton>
            </div>
          </div>
        </Shell>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto flex w-[min(100%-2rem,1120px)] flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground md:flex-row">
      <span className="flex items-center gap-2.5">
        <LogoMark className="h-4 text-brand" />
        <span className="font-medium text-foreground">AEGIS</span>
        <span>· Team {TEAM} · Smart India Hackathon 2026</span>
      </span>
      <div className="flex items-center gap-5">
        <a href="#performance" className="hover:text-foreground">Performance</a>
        <a href="#resilience" className="hover:text-foreground">Resilience</a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
      </div>
    </footer>
  );
}
