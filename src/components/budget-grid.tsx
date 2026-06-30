import type { BudgetWithProgress } from "@/types/budget";
import { BudgetCard } from "@/components/budget-card";

export function BudgetGrid({
  globalBudget,
  categoryBudgets,
}: {
  globalBudget: BudgetWithProgress | undefined;
  categoryBudgets: BudgetWithProgress[];
}) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Global Budget
        </h2>
        {globalBudget ? (
          <BudgetCard budget={globalBudget} />
        ) : (
          <p className="text-sm text-zinc-400">No global budget set for this month.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          By Category
        </h2>
        {categoryBudgets.length === 0 ? (
          <p className="text-sm text-zinc-400">No category budgets set for this month.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryBudgets.map((b) => (
              <BudgetCard key={b.id} budget={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
