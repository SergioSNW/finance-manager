export const dynamic = "force-dynamic";

import { getTransactions } from "@/server/queries/transactions";
import { getAccounts } from "@/server/queries/accounts";
import { getCategories } from "@/server/queries/categories";
import { TransactionTable } from "@/components/transaction-table";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    accountId?: string;
    categoryId?: string;
    search?: string;
  }>;
}) {
  const filters = await searchParams;
  const transactions = getTransactions({
    accountId: filters.accountId,
    categoryId: filters.categoryId,
    search: filters.search,
  });
  const accounts = getAccounts();
  const categories = getCategories();

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Transactions
        </h1>
        <div className="flex gap-2">
          <Link
            href="/transactions/import"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Import CSV
          </Link>
          <Link
            href="/transactions/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            + Add Transaction
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <form className="flex flex-wrap gap-3">
          <select
            name="accountId"
            defaultValue={filters.accountId || ""}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            name="categoryId"
            defaultValue={filters.categoryId || ""}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="search"
            defaultValue={filters.search || ""}
            placeholder="Search..."
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm dark:bg-zinc-800 dark:text-zinc-300"
          >
            Filter
          </button>
        </form>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description={
            filters.accountId || filters.categoryId || filters.search
              ? "Try adjusting your filters."
              : "Add your first transaction to get started."
          }
          action={
            !filters.accountId && !filters.categoryId && !filters.search ? (
              <Link
                href="/transactions/new"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Add Transaction
              </Link>
            ) : null
          }
        />
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
}
