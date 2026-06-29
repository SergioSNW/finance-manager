---
name: fin-ledger
description: Project-level conventions and architecture for the FinLedger finance management app. Use this skill whenever working on this project — it describes the stack, file structure, naming conventions, and architectural decisions. Always load this skill first before any other FinLedger skill, and re-read it whenever the user asks about project structure, dependencies, scripts, or conventions.
---

# FinLedger Project Conventions

FinLedger is a personal finance management application built with Next.js 16, React 19, and TypeScript.

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.9 | **This is NOT the Next.js you know** — read `node_modules/next/dist/docs/` before writing code |
| UI | React 19.2.4 | Server components by default |
| Language | TypeScript 5 | strict mode enabled |
| Styling | Tailwind CSS 4 | via `@tailwindcss/postcss` |
| Linting | ESLint 9 | config at `eslint.config.mjs` |

## Architecture

- **App Router** — all routes in `src/app/`
- **Server-first** — default to server components; add `"use client"` only when needed (event handlers, browser APIs, state)
- **Server Actions** — use for form mutations (not API routes unless integrating with external services)
- **Path aliases** — `@/*` maps to `src/*`

## File Conventions

```
src/
├── app/                    # App Router pages and layouts
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles / Tailwind
│   └── (routes)/           # Feature routes
├── components/             # Shared UI components
├── lib/                    # Utilities, helpers, config
├── server/                 # Server-only logic (server actions, db queries)
└── types/                  # Shared TypeScript types
```

- **Components**: `PascalCase.tsx` — one component per file, exported as default
- **Utilities**: `camelCase.ts` — named exports
- **Server actions**: `camelCase.ts` with `"use server"` at top
- **Types**: `PascalCase.ts` — interfaces and type aliases
- **CSS**: Tailwind utility classes in JSX; global styles only in `globals.css`

## Naming

- **Components**: `TransactionTable`, `AccountCard`, `CategorySelect`
- **Functions**: `formatCurrency`, `fetchTransactions`, `validateAmount`
- **Files**: `transaction-table.tsx`, `format-currency.ts`, `api.ts`
- **Routes**: kebab-case (`/transaction-history`, `/budget-settings`)
- **Environment variables**: `NEXT_PUBLIC_*` for client-side, `DATABASE_URL` for server-only

## State Management

- Server components for data fetching (async components)
- URL search params for filters, sorting, pagination
- React state / useReducer for local UI state
- Avoid global state libraries unless necessary

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

## Key Constraints

- Do NOT add dependencies without checking `package.json` first
- Next.js 16 has breaking changes from earlier versions — consult `node_modules/next/dist/docs/` before using any Next.js API
- React 19 server components are the default — understand the server/client boundary
- Tailwind v4 uses the new `@tailwindcss/postcss` plugin (not the old `tailwind.config.js`)
