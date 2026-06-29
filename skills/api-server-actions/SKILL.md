---
name: api-server-actions
description: Patterns for implementing server actions, API routes, and backend logic in the FinLedger app. Use this skill when creating or modifying server actions, API routes, authentication/authorization logic, input validation, error handling, data revalidation, or optimistic update patterns. Also trigger when the user mentions form handling, data mutation, webhooks, or backend endpoints.
---

# API & Server Action Patterns

Backend patterns for FinLedger using Next.js 16 server actions and API routes.

## Server Actions

Server actions are the primary mechanism for data mutations. Use them over API routes unless you need webhook compatibility or third-party access.

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod"; // or your validation library

const createTransactionSchema = z.object({
  accountId: z.string().cuid(),
  amount: z.number().int(), // cents
  description: z.string().min(1).max(500),
  categoryId: z.string().cuid().nullable(),
  date: z.string().date(),
});

export async function createTransaction(formData: FormData) {
  // 1. Authenticate — get current user session
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // 2. Validate input
  const parsed = createTransactionSchema.parse({
    accountId: formData.get("accountId"),
    amount: Number(formData.get("amount")),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
  });

  // 3. Authorize — user owns the account
  const account = await getAccount(parsed.accountId);
  if (account.userId !== session.user.id) throw new Error("Forbidden");

  // 4. Execute mutation
  await db.transaction.create({ data: parsed });

  // 5. Revalidate
  revalidatePath("/transactions");
  revalidatePath("/dashboard");

  // 6. Return result
  return { success: true };
}
```

### Server action conventions
- Always export `async function` with `"use server"` directive
- Always authenticate first, authorize second
- Use `zod` or similar for input validation (never trust raw `formData`)
- Validate on both client and server
- Always call `revalidatePath` or `revalidateTag` after mutations
- Return structured responses: `{ success: true }` or `{ error: string }`
- Catch and return errors gracefully (don't throw to the error boundary for validation errors)

## API Routes

Use API routes only for:
- Webhooks (external services calling into the app)
- Server-to-server integrations
- Public endpoints that don't need React rendering

```typescript
// src/app/api/webhooks/plaid/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // Validate webhook signature
  // Process webhook event
  return Response.json({ received: true });
}
```

## Error Handling

```typescript
// Pattern: ActionError for user-facing errors
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

// In server action:
export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session) throw new ActionError("Please sign in to continue");

  const tx = await db.transaction.findUnique({ where: { id } });
  if (!tx) throw new ActionError("Transaction not found");
  if (tx.userId !== session.user.id) throw new ActionError("Access denied");

  await db.transaction.delete({ where: { id } });
  revalidatePath("/transactions");
}
```

## Client-side Consumption

```typescript
// Use React's useActionState or useTransition
"use client";

import { useActionState } from "react";
import { createTransaction } from "@/server/actions/transactions";

export function TransactionForm() {
  const [state, formAction, pending] = useActionState(
    createTransaction,
    { success: false, error: null }
  );

  return (
    <form action={formAction}>
      {/* fields */}
      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Add Transaction"}
      </button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
```

## Optimistic Updates

For non-critical UI (likes, toggles), use optimistic updates:

```typescript
// Use React 19's useOptimistic
// Update the UI immediately, revert if the server action fails
```

## Auth Guard Helper

```typescript
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new ActionError("Authentication required");
  return session;
}

export async function requireOwnership(resource: { userId: string }) {
  const session = await requireAuth();
  if (resource.userId !== session.user.id) {
    throw new ActionError("You don't have access to this resource");
  }
}
```

## Revalidation Strategy

- `revalidatePath` after mutations that affect a page
- `revalidateTag` for data cached with `next/cache` tags
- Revalidate the specific path, not everything
- Consider `revalidatePath('/')` only when the change affects the entire app
