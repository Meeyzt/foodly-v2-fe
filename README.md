# foodly-v2-fe

Greenfield frontend repo for **Foodly v2**.

## Tech Choice

**Next.js (App Router + TypeScript)** was selected over Nuxt for this setup because:
- Team/ecosystem fit with React stack
- Strong production defaults (SSR/ISR, routing, middleware)
- Fast onboarding for modular enterprise FE architecture

## Included Foundation

- **Modular folder structure** (`app`, `features`, `shared`, `test`)
- **Auth baseline**
  - login feature module
  - zustand auth store
  - cookie/token session bootstrap
  - route protection via `middleware.ts`
- **State management**: `zustand`
- **API client layer**: centralized Axios client with base URL + auth interceptor
- **Env template**: `.env.example`
- **Quality pipeline**
  - ESLint
  - TypeScript typecheck
  - Vitest + Testing Library
  - Build verification

## Sprint-0 Documentation

- `docs/PRD_DRAFT.md` → hedef kullanıcı, ana akışlar, MVP kapsam
- `docs/IA_ROUTES.md` → bilgi mimarisi ve route haritası
- `docs/FE_ARCH.md` → state/api/auth guard/error handling mimarisi
- `docs/SPRINT0_TASKS.md` → Sprint-0 backlog (dependency + DoD + test kriteri)

## Project Structure

```txt
src/
  app/
    (auth)/login
    (protected)/dashboard
  features/
    auth/
      api/
      components/
      model/
  shared/
    api/
    config/
    lib/
    types/
    ui/
  test/
docs/
```

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Run

```bash
npm run dev
```

## CI-Ready Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

`npm run check` runs lint + typecheck + tests in sequence.
