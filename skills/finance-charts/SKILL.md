---
name: finance-charts
description: Data visualization, dashboard layout, and reporting patterns for FinLedger. Use this skill when adding charts, building financial dashboards, implementing period-over-period comparisons, creating budget vs actual visualizations, generating spending breakdowns, or building exportable reports (PDF/CSV). Also trigger when the user asks about financial insights, trends, or analytics.
---

# Finance Charts & Reports

Patterns for visualizing financial data in FinLedger.

## Dashboard Layout

The main dashboard should display:
1. **Net worth card** (top-left, prominent) — total assets minus liabilities
2. **Monthly summary row** — income, expenses, savings rate for the current period
3. **Spending by category** — donut/ring chart
4. **Budget vs actual** — horizontal bar chart showing each budget category
5. **Cash flow** — line chart of income and expenses over last 12 months
6. **Recent transactions** — last 5 transactions in a compact list

Each card/chart should be independently loading (skeleton states) so one slow query doesn't block the rest.

## Chart Patterns

### Spending by category (donut chart)
- Top 5 categories + "Other"
- Clicking a segment filters the transaction list below
- Show percentage and amount on hover

### Cash flow (line chart)
- Two series: income (green), expenses (red)
- X-axis: months, Y-axis: amount
- Show 12-month rolling view by default, toggleable to 3/6 months
- Toggle cumulative mode (net savings over time)

### Budget vs actual (horizontal bars)
- One row per budget category
- Bar shows actual spending relative to budget
- Color: green (under budget), yellow (near limit), red (over budget)
- Show remaining amount on each row

### Net worth (area chart or big number)
- Area chart showing net worth over time with gradient fill
- Large number display for current net worth
- Change indicator (up/down arrow + percentage vs last month)

## Chart Implementation

Prefer lightweight SVG-based charts. Do NOT add a heavy charting library for simple use cases — use inline SVG or a minimal library. If a library is needed, check `package.json` first for what's already available.

```tsx
// Pattern: chart component with responsive sizing
// Accept a container ref and draw into it
// Use ResizeObserver for responsive updates
```

### Responsive charts
- Always use a `ResizeObserver` to handle container resizing
- Set a minimum aspect ratio (e.g., 16:9 for line charts, 1:1 for donuts)
- Show at minimum the data, no chart junk
- Include accessible data table below each chart (hidden visually but available to screen readers)

## Report Generation

### CSV export
- Generate on the server, return a `Blob`
- Use consistent date formatting (ISO 8601)
- Include a header row with column names
- Transactions: date, description, category, amount, account, notes

### PDF export (future)
- Use a server-side approach (e.g., PDF generation library)
- Include: date range, account summary, transaction list, category breakdown
- Branded with FinLedger header

## Data Fetching for Charts

- Server components fetch aggregated data directly
- No client-side data fetching for initial render
- Allow date range filtering via search params
- Cache aggregation results where possible (same params = cached result)
- Use SQL aggregation functions (`SUM`, `GROUP BY`, `DATE_TRUNC`) rather than client-side math
