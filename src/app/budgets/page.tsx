export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBudgets } from "@/server/queries/budgets";
import { BudgetGrid } from "@/components/budget-grid";

export default async function BudgetsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const budgets = await getBudgets(month, year);

  const globalBudget = budgets.find((b) => b.categoryId === null);
  const categoryBudgets = budgets.filter((b) => b.categoryId !== null);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Budgets
        </h1>
        <Link
          href="/budgets/new"
          className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          New Budget
        </Link>
      </div>

      <BudgetGrid globalBudget={globalBudget} categoryBudgets={categoryBudgets} />
    </div>
  );
}
