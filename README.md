# BuyHat Frontend

Production-grade e-commerce **storefront + admin panel** for the BuyHat platform — a single
Next.js 15 (App Router) application in TypeScript.

> **Design source of truth:** `buyhat_e_commerce_design_system/` (nexus — _SaaS Commerce Velocity_).
> **Backend:** `../Buyhat_backend` · REST base `http://localhost:3000/api/v1`.
> **Roadmap:** [`docs/FRONTEND_PROJECT_PLAN.md`](./docs/FRONTEND_PROJECT_PLAN.md) /
> `BuyHat_Frontend_Project_Plan.docx` — 14 phases (0 → 13).

## Tech stack

| Concern      | Choice                                                  |
| ------------ | ------------------------------------------------------- |
| Framework    | Next.js 15 (App Router, RSC)                            |
| Language     | TypeScript (strict)                                     |
| Styling      | Tailwind CSS v4 (`@theme` tokens)                       |
| UI           | shadcn/ui + Radix + Lucide                              |
| Server state | TanStack Query                                          |
| Client state | Zustand                                                 |
| Forms        | React Hook Form + Zod                                   |
| HTTP         | Axios (single client + interceptors)                    |
| Auth         | JWT access (memory) + refresh (httpOnly cookie via BFF) |
| Tooling      | ESLint · Prettier · Husky · lint-staged · commitlint    |

## Getting started

```bash
cp .env.example .env.local   # adjust if your backend isn't on :3000
npm install
npm run dev                  # http://localhost:3001  (backend expected on :3000)
```

## Scripts

| Script                            | Purpose                             |
| --------------------------------- | ----------------------------------- |
| `npm run dev`                     | Dev server (Turbopack) on port 3001 |
| `npm run build`                   | Production build                    |
| `npm run start`                   | Serve production build              |
| `npm run lint` / `lint:fix`       | ESLint                              |
| `npm run typecheck`               | `tsc --noEmit`                      |
| `npm run format` / `format:check` | Prettier                            |
| `npm run validate`                | lint + typecheck + format check     |

## Architecture (feature-based)

```
src/
  app/            # routes — (shop) (admin) (auth) api/   (thin; compose features)
  components/     # ui/ (shadcn)  shared/ (composites)  layout/ (shells)
  features/       # auth catalog cart checkout orders profile reviews
                  # promotions cms inventory payments admin-dashboard search
                  #   each: components/ hooks/ api/ schemas/
  services/       # api-client + low-level domain services
  hooks/  store/  lib/  types/  config/  constants/  providers/  styles/  assets/
```

**Data-flow contract:** `Component → Feature Hook (TanStack Query) → Service (typed) → Axios client → Backend`.
UI never calls `fetch`/`axios` directly. Server data lives in TanStack Query; global UI state in
Zustand; ephemeral state local. See the project plan for full rules.

## Environment

Validated at boot via [`src/config/env.ts`](./src/config/env.ts) (Zod). See `.env.example`.

## Conventions

- Conventional Commits (enforced by commitlint on `commit-msg`).
- `pre-commit` runs `lint-staged` (ESLint + Prettier on staged files).
- Strict TypeScript; no `any`.

---

_Build proceeds phase by phase per the project plan; each phase is self-reviewed to
production quality before the next begins._
