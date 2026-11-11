# ATLAS — Project Progress

This file tracks the eight ATLAS phases. Phases 0 and 2 were completed by **Task ID 0-ENV** in a single autonomous session; all other phases are owned by other agents and listed here for context.

## Phase checklist

- [x] **Phase 0 — Environment Cartography** — Mapped the sandbox (Debian 13 trixie, 2-vCPU Intel Xeon, 4.1 GiB RAM, no swap, kata-container under KVM); produced 7 env docs under `docs/environment/` (00-index → 07-benchmarks) plus the validated `seed-data/benchmarks.json`.
- [ ] **Phase 1 — Seed Data Design** — (owned by another agent) Define the canonical seed-data schemas and generators.
- [x] **Phase 2 — Computational Stress Tests** — Ran 10 Python benchmarks (CSV gen, sort, JSON, SHA-256, regex, str.replace, 100×100 matmul, recursive `fib(30)`, 10k small-file write, 10k read+delete); total wall-clock ~1.52 s, exit code 0, results persisted to `seed-data/benchmarks.json` and tabled in `docs/environment/07-benchmarks.md`.
- [ ] **Phase 3 — Persistence Layer** — (owned by another agent) Prisma migrations + seeding against the seed data.
- [ ] **Phase 4 — API Surface** — (owned by another agent) Next.js route handlers / server actions.
- [ ] **Phase 5 — UI / Components** — (owned by another agent) shadcn/ui pages and component library.
- [ ] **Phase 6 — Integration & E2E** — (owned by another agent) Playwright / Vitest end-to-end suite.
- [ ] **Phase 7 — Deploy & Operate** — (owned by another agent) Caddyfile, env wiring, and runbooks.

## Phase 6: Documentation (Task ID 6-DOCS)

The full ATLAS documentation suite was written by Task ID 6-DOCS in a
single main-session pass with full tool access (the main-session tool
outage that affected earlier phases had resolved by the time the docs
phase began). The deliverables are:

```
docs/
├── architecture.md         (~3,580 words — system architecture, Mermaid diagrams, ERD, deployment topology)
├── api-reference.md        (~4,610 words — every endpoint, Zod schemas, curl examples, error catalog)
├── component-library.md    (~5,140 words — every ATLAS component, props tables, usage examples)
├── testing-guide.md       (~4,000 words — manual protocol, curl sweep, future Vitest + Playwright plan)
├── deployment-guide.md    (~3,330 words — Vercel, env vars, security headers, troubleshooting, rollback)
├── performance-tuning.md   (~3,800 words — frontend, backend, DB, caching, 10-benchmark baseline profile)
├── security.md            (~4,290 words — threat model, measures, no-auth gap, NextAuth plan)
├── contributing.md         (~2,890 words — code style, PR process, recipes for new views/benchmarks)
├── capability-report.md   (~10,280 words — the crown-jewel self-assessment, 14 sections)
└── decisions/
    ├── adr-01-nextjs-16-app-router.md
    ├── adr-02-prisma-sqlite.md
    ├── adr-03-zustand-view-state.md
    ├── adr-04-react-query-server-state.md
    ├── adr-05-recharts.md
    ├── adr-06-no-auth-v1.md
    ├── adr-07-vercel-deploy.md
    ├── adr-09-single-page-view-switching.md
    ├── adr-10-shadcn-new-york.md
    └── adr-11-live-benchmark-subprocess.md
```

Total: ~50,000 words across 19 new files. Every doc was written from
direct reads of the ATLAS source code — `prisma/schema.prisma`,
`src/types/atlas.ts`, all 10 `src/app/api/*/route.ts` files, all 6
views, all 8 charts, all 7 UI atoms, the layout shell, the hooks file,
the libs, the package.json, the next.config.ts, the tsconfig, the
eslint config, the existing `docs/environment/*.md` cartography, and
the `seed-data/benchmarks.json` real benchmark results.

Key facts documented honestly:

- The **serverless caveats**: SQLite does not persist on Vercel; the
  live `python3` subprocess cannot spawn on Vercel. Both have
  mitigations documented in the deployment guide and ADR-11.
- The **no-auth gap**: v1 has no authentication; v2 plan adds
  NextAuth with GitHub OAuth + API-key providers.
- The **TypeScript build bypass**: `next.config.ts` sets
  `typescript.ignoreBuildErrors: true`; the PR checklist requires
  `bunx tsc --noEmit` manually.
- The **main-session tool outage**: documented in the capability
  report §13.1; earlier phases were forced into a subagent-only
  execution model.
- The **unused dependencies**: ~6 packages in `package.json` that
  ATLAS doesn't actually import; documented in security.md §7.1.
- The **GitHub-link inconsistency**: `app-header.tsx` and
  `settings-view.tsx` link to `https://github.com` (generic) rather
  than `https://github.com/AutomatedLabor/atlas` (the repo).

The documentation suite cross-references itself extensively. The
architecture doc points to every ADR; the ADRs point to the
deployment guide; the deployment guide points to the testing guide;
the testing guide points to the component library; the component
library points to the API reference; the API reference points to the
architecture; the capability report (the crown jewel) points to all
of the above.

## Files delivered by Phase 0 / Phase 2

```
docs/environment/
├── 00-index.md
├── 01-os-hardware.md
├── 02-filesystem.md
├── 03-software.md
├── 04-runtime-capabilities.md
├── 05-network.md
├── 06-tool-capabilities.md
└── 07-benchmarks.md

seed-data/
└── benchmarks.json
```

## Headline numbers

| Metric | Value | Source |
|--------|-------|--------|
| OS | Debian 13 trixie, kernel 5.10.134 | `01-os-hardware.md` |
| CPU | Intel Xeon, 2 vCPU / 2 thread | `01-os-hardware.md` |
| Memory | 4.1 GiB RAM, **0 B swap** | `01-os-hardware.md` |
| Public egress IP | 8.212.10.159 | `05-network.md` |
| 100 MB file write | 2.7 GB/s in 38 ms | `02-filesystem.md` |
| Parallel HTTPS | 50/50 → HTTP 200 | `05-network.md` |
| Slowest benchmark | `read_sort_1m` — 298.6 ms | `07-benchmarks.md` |
| Fastest benchmark | `sha256_10k` — 5.5 ms | `07-benchmarks.md` |
