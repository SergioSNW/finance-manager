"use client";

import { useActionState } from "react";
import { updateBudget, deleteBudget } from "@/server/actions/budgets";
import type { Budget } from "@/types/budget";
import { decimalFromCents } from "@/lib/format";

export function EditBudgetForm({ budget }: { budget: Budget }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => updateBudget(budget.id, fd),
    null
  );

  return (
    <>
      {state && "error" in state && (
        <p className="mb-4 text-sm text-red-500">{state.error}</p>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Budget Amount ($)
          </label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0"
            defaultValue={decimalFromCents(budget.amountCents)}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {budget.rolloverCents > 0 && (
          <p className="text-xs text-indigo-500">
            +<span className="font-medium">{decimalFromCents(budget.rolloverCents)}</span> saved from last month
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form
        action={async () => { await deleteBudget(budget.id); }}
        className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700"
      >
        <button
          type="submit"
          className="cursor-pointer text-sm text-red-500 hover:text-red-400"
          onClick={(e) => { if (!confirm("Delete this budget?")) e.preventDefault(); }}
        >
          Delete Budget
        </button>
      </form>
    </>
  );
}
