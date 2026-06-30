"use client";

import { useActionState } from "react";
import { createBudget } from "@/server/actions/budgets";
import type { Category } from "@/types/category";

export function BudgetForm({ categories, month, year }: { categories: Category[]; month: number; year: number }) {
  const [state, action, pending] = useActionState(
    async (_prev: unknown, fd: FormData) => createBudget(fd),
    null
  );

  return (
    <form action={action} className="space-y-4">
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Category
        </label>
        <select
          name="categoryId"
          defaultValue=""
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">Global Budget (all expenses)</option>
          {categories
            .filter((c) => c.type === "expense")
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Month
        </label>
        <select
          name="month"
          defaultValue={month}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(year, i).toLocaleDateString("en-US", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Year
        </label>
        <select
          name="year"
          defaultValue={year}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Budget Amount ($)
        </label>
        <input
          type="number"
          name="amount"
          step="0.01"
          min="0"
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Budget"}
      </button>
    </form>
  );
}
