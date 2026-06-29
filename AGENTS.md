# FinLedger

Take control of your finances.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 |
| UI | React 19.2.4 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Linting | ESLint 9 |

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Architecture

- **App Router** — all routes in `src/app/`
- **Server-first** — default to server components; add `"use client"` only when needed
- **Server Actions** — primary mechanism for data mutations
- **Path aliases** — `@/*` maps to `src/*`
- **Monetary values** — stored as integers (cents), never floats

## Skills

The following project skills are available in `skills/`. Load the relevant skill before working on a task in that domain.

| Skill | When to load |
|-------|-------------|
| [`fin-ledger`](skills/fin-ledger/SKILL.md) | Always — conventions, architecture, stack, file structure |
| [`financial-data`](skills/financial-data/SKILL.md) | Data modeling, schemas, monetary logic, queries, financial calculations |
| [`finance-ui`](skills/finance-ui/SKILL.md) | UI components, forms, data tables, layouts, Tailwind patterns |
| [`finance-charts`](skills/finance-charts/SKILL.md) | Dashboards, charts, reports, data visualization, CSV/PDF export |
| [`api-server-actions`](skills/api-server-actions/SKILL.md) | Server actions, API routes, auth, validation, error handling |

### Creating or modifying skills

This project uses the [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) tool from Anthropic for developing skills. It's installed at `.agents/skills/skill-creator`. To create a new skill or refine an existing one, load the skill-creator skill.

## Development

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint
```

## Directory layout

```
src/
├── app/              # App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── (routes)/
├── components/       # Shared React components
├── lib/              # Utilities and helpers
├── server/           # Server logic (actions, queries)
└── types/            # Shared TypeScript types
```

## Testing

_(Not yet configured — add test commands here when the testing framework is set up.)_
