"use client";

import type { BudgetWithProgress } from "@/types/budget";
import { AmountDisplay } from "@/components/amount-display";
import { deleteBudget } from "@/server/actions/budgets";

const statusConfig = {
  on_track: { bar: "bg-green-500", text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", label: "On track" },
  near_limit: { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", label: "Near limit" },
  exceeded: { bar: "bg-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", label: "Exceeded" },
};

export function BudgetCard({ budget }: { budget: BudgetWithProgress }) {
  const cfg = statusConfig[budget.status];

  async function handleDelete() {
    if (!confirm("Delete this budget?")) return;
    await deleteBudget(budget.id);
  }

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} border-zinc-200 dark:border-zinc-700`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {budget.categoryName ?? "Global Budget"}
          </p>
          <p className="text-xs text-zinc-400">
            {budget.month}/{budget.year}
          </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.text} ${cfg.bg}`}>
          {cfg.label}
        </span>
      </div>

      <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${cfg.bar}`}
          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
        />
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
        <span><AmountDisplay cents={budget.actualSpent} /> spent</span>
        <span>of <AmountDisplay cents={budget.available} /></span>
      </div>

      <div className="flex items-center justify-between text-xs">
        {budget.remaining >= 0 ? (
          <span className="text-green-600 dark:text-green-400">
            <AmountDisplay cents={budget.remaining} /> remaining
          </span>
        ) : (
          <span className="text-red-600 dark:text-red-400">
            <AmountDisplay cents={Math.abs(budget.remaining)} /> over
          </span>
        )}
        {budget.rolloverCents > 0 && (
          <span className="text-indigo-500">
            +<AmountDisplay cents={budget.rolloverCents} /> saved
          </span>
        )}
      </div>

      {budget.status === "exceeded" && (
        <p className="mt-2 text-xs text-red-500">
          🔴 Exceeded by <AmountDisplay cents={Math.abs(budget.remaining)} />
        </p>
      )}
      {budget.status === "near_limit" && (
        <p className="mt-2 text-xs text-amber-500">
          ⚠️ {Math.round(budget.percentage)}% used
        </p>
      )}

      <div className="mt-3 flex gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
        <button
          onClick={handleDelete}
          className="cursor-pointer text-xs text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
