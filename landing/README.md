# AEGIS landing page

Standalone marketing site for AEGIS, separate from the SOC console in `dashboard-security/`.

Next.js 16 · React 19 · Tailwind v4 · shadcn (@kobra navigation menu, halftone dots, sound) · Recharts · GSAP.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Every figure on the page lives in `src/lib/data.ts`. Measured numbers come from `docs/status.md` and the result files
under `benchmarks/results/`; scale figures are projections from the measured single-node ceiling and are labelled
"Projected" wherever they appear.
