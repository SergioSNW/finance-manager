---
name: finance-ui
description: UI component patterns, form conventions, and design system guidelines for the FinLedger finance management app. Use this skill when building UI components, designing forms for financial data entry, implementing data display tables, creating layouts, or styling with Tailwind CSS v4. Trigger when the user mentions adding a form, table, card, modal, or any UI element for the finance application.
---

# Finance UI Patterns

UI conventions for the FinLedger app, using Tailwind CSS v4 with the project's design language.

## Design Tokens

These come from the current Tailwind theme and `globals.css`. Reference the existing styles rather than inventing new ones.

- **Font**: Geist Sans (body) and Geist Mono (tabular numbers, code)
- **Background**: white / `zinc-50` light, `zinc-950` dark
- **Text**: `zinc-900` / `zinc-100`
- **Muted**: `zinc-500` / `zinc-400`
- **Accent**: blue or emerald for positive (inflow), red for negative (outflow)
- **Border**: `zinc-200` / `zinc-800`
- **Border radius**: `rounded-lg` (standard), `rounded-xl` (cards/modals)

## Component Patterns

### Page layout
Every page should be a server component that fetches data and passes it to client components where interactivity is needed.

```tsx
// page.tsx — server component
export default async function TransactionsPage() {
  const transactions = await getTransactions();
  return <TransactionList initialData={transactions} />;
}
```

### Data tables
Use a reusable table component with:
- Sortable columns (controlled by URL search params)
- Pagination (offset-based via search params)
- Row actions menu (edit, delete, view)
- Loading skeleton during client transitions
- Empty state when no data

### Form patterns
- Server actions for submission
- Client-side validation for instant feedback (pattern: validate on blur + on submit)
- Server-side validation for security (re-validate on the server)
- Disable submit button while pending
- Show success/error toast after submission
- Confirmation dialogs for destructive actions (delete transaction, remove account)

### Amount input
Always use `inputMode="decimal"` and format as the user types. Store in cents internally.

```tsx
<input
  type="text"
  inputMode="decimal"
  pattern="[0-9]*\.?[0-9]{0,2}"
  placeholder="0.00"
/>
```

### Category selector
- Dropdown or combobox with search
- Show category color dot + icon + name
- Group by type (income / expense)
- Allow creating new categories inline

### Date picker
Use a native `<input type="date">` for mobile-friendly date selection. Wrap in a styled container for desktop.

## Responsive Breakpoints

- `sm` (640px): single-column forms, stacked cards
- `md` (768px): two-column layouts, sidebars
- `lg` (1024px): full dashboard with tables
- `xl` (1280px): side-by-side charts and data

## Accessibility

- All form inputs must have associated labels
- Use `aria-invalid` on errored inputs
- Color is never the only indicator (use text + icon + color)
- Financial amounts use `<span aria-label="$19.99">` for screen readers
- Sortable table headers are `<button>` elements with `aria-sort`

## Dark Mode

Use Tailwind's `dark:` variant. The root `<html>` element has the class toggled by a theme switcher. All components must support both modes.

```tsx
<div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
```

## Loading States

- Initial page load: async server component (Next.js Suspense boundary)
- Client navigation: loading skeleton matching the content shape
- Form submission: button loading spinner + disabled state
- Optimistic updates: update UI immediately, revert on error
