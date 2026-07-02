import { getBudgets, getAlertsForDashboard, getTotalSavings } from "@/server/queries/budgets";
import { AmountDisplay } from "@/components/amount-display";
import Link from "next/link";

export async function DashboardBudgetSummary() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const budgets = await getBudgets(month, year);
  const alerts = await getAlertsForDashboard();
  const totalSavings = await getTotalSavings();

  const globalBudget = budgets.find((b) => b.categoryId === null);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Budget Overview
        </h2>
        <Link
          href="/budgets"
          className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          View all
        </Link>
      </div>

      {globalBudget && (
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Global</span>
            <span className="text-zinc-700 dark:text-zinc-300">
              <AmountDisplay cents={globalBudget.actualSpent} /> / <AmountDisplay cents={globalBudget.available} />
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className={`h-full rounded-full transition-all ${
                globalBudget.status === "exceeded" ? "bg-red-500" : globalBudget.status === "near_limit" ? "bg-amber-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(globalBudget.percentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mb-3 space-y-1.5">
          <p className="text-xs font-medium text-zinc-500">Alerts</p>
          {alerts.slice(0, 3).map((a) => (
            <div
              key={a.budgetId}
              className={`rounded-lg px-3 py-2 text-xs ${
                a.status === "exceeded"
                  ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
              }`}
            >
              {a.categoryName ?? "Global"} &mdash; {Math.round(a.percentage)}% used
            </div>
          ))}
          {alerts.length > 3 && (
            <p className="text-xs text-zinc-400">+{alerts.length - 3} more</p>
          )}
        </div>
      )}

      {totalSavings > 0 && (
        <div className="rounded-lg bg-indigo-50 px-3 py-2 dark:bg-indigo-950/30">
          <p className="text-xs text-indigo-600 dark:text-indigo-400">
            Total savings accumulated: <strong><AmountDisplay cents={totalSavings} /></strong>
          </p>
        </div>
      )}

      {!globalBudget && alerts.length === 0 && totalSavings === 0 && (
        <p className="text-sm text-zinc-400">No budgets set for this month.</p>
      )}
    </div>
  );
}
