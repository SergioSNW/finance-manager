export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCategories } from "@/server/queries/categories";
import { BudgetForm } from "@/components/budget-form";

export default function NewBudgetPage() {
  const categories = getCategories();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/budgets" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          New Budget
        </h1>
      </div>

      <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-950">
        <BudgetForm categories={categories} month={month} year={year} />
      </div>
    </div>
  );
}
