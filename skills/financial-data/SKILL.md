---
name: financial-data
description: Data modeling and query patterns for financial entities in the FinLedger app. Use this skill whenever designing schemas, writing database queries, handling monetary values, implementing financial calculations, or modeling entities like accounts, transactions, categories, budgets, or recurring entries. Also use when formatting currency, calculating balances, aggregating spending, or implementing period-over-period comparisons.
---

# Financial Data Modeling

Patterns for modeling financial data in the FinLedger application.

## Monetary Values

Store all monetary amounts as **integers representing cents** (or the smallest currency unit). Never use floats.

```typescript
// ✅ Correct
type Money = number; // cents
const amount = 1999; // $19.99

// ❌ Wrong
const amount = 19.99; // float — rounding errors
```

Display formatting using `Intl.NumberFormat`:

```typescript
export function formatCurrency(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
```

## Core Entities

### Account
- `id: string` — cuid or uuid
- `name: string` — user-given name ("Checking", "Savings")
- `type: AccountType` — checking, savings, credit, investment, cash
- `balance: number` — current balance in cents
- `currency: string` — ISO 4217 ("USD")
- `isActive: boolean` — soft delete / hide
- `createdAt: Date`, `updatedAt: Date`

### Transaction
- `id: string`
- `accountId: string` — foreign key to Account
- `amount: number` — signed integer in cents (positive = inflow, negative = outflow)
- `description: string`
- `categoryId: string | null`
- `date: Date` — the transaction date (not created date)
- `isReconciled: boolean`
- `createdAt`, `updatedAt`

### Category
- `id: string`
- `name: string` — "Groceries", "Rent", "Income:Salary"
- `type: CategoryType` — income, expense, transfer
- `color: string` — hex color for UI
- `parentId: string | null` — for hierarchical categories
- `icon: string | null` — icon identifier

### Budget
- `id: string`
- `categoryId: string`
- `amount: number` — budgeted amount in cents
- `period: BudgetPeriod` — monthly, weekly, yearly, custom
- `startDate: Date`
- `endDate: Date | null`

### RecurringTransaction
- `id: string`
- `accountId: string`
- `categoryId: string | null`
- `amount: number` — in cents
- `description: string`
- `frequency: Frequency` — daily, weekly, monthly, yearly
- `interval: number` — every N periods
- `nextDate: Date`
- `endDate: Date | null`

## Common Queries

### Running balance
Sum all transactions for an account up to a date, ordered chronologically:

```typescript
// SELECT SUM(amount) FROM transactions
// WHERE account_id = ? AND date <= ?
// ORDER BY date ASC
```

### Monthly spending by category
```typescript
// SELECT category_id, SUM(amount) as total
// FROM transactions
// WHERE date BETWEEN ? AND ?
//   AND amount < 0
// GROUP BY category_id
```

### Budget vs actual
For a given period, compare budgeted amount against sum of transactions per category.

### Net worth over time
Aggregate account balances at regular intervals (end of each month) by joining all non-credit accounts.

## Validation Patterns

- Amounts must not exceed `Number.MAX_SAFE_INTEGER` (9 quadrillion cents)
- Transaction dates cannot be in the future beyond a reasonable window
- Account names must be unique per user
- Category hierarchies max 3 levels deep
- Budget periods must not overlap for the same category

## Number Precision

- Calculations: do math in cents (integers), only convert for display
- Division: use `Math.round()` or integer division
- Percentages: store as basis points (integer, 1 bps = 0.01%)
- Avoid floating point arithmetic entirely
