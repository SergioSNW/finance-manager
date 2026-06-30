"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/server/actions/transactions";
import { todayISO } from "@/lib/format";
import type { Account, Category } from "@/types";

export function TransactionForm({
  accounts,
  categories,
  defaultAccountId,
}: {
  accounts: Pick<Account, "id" | "name">[];
  categories: Pick<Category, "id" | "name" | "type" | "color">[];
  defaultAccountId?: string;
}) {
  const router = useRouter();
  const wrapped = async (_prev: unknown, fd: FormData) => createTransaction(fd);
  const [state, action, pending] = useActionState(wrapped, null);

  if (state?.success) {
    router.push("/transactions");
  }

  const expenseCats = categories.filter((c) => c.type === "expense");
  const incomeCats = categories.filter((c) => c.type === "income");

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Account
        </label>
        <select
          name="accountId"
          required
          defaultValue={defaultAccountId || ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="" disabled>
            Select account
          </option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Type
        </label>
        <select
          name="type"
          required
          defaultValue="expense"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Amount
        </label>
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="0.00"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <input
          name="description"
          required
          placeholder="What was this for?"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Category
        </label>
        <select
          name="categoryId"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">Uncategorized</option>
          <optgroup label="Expenses">
            {expenseCats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Income">
            {incomeCats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Date
        </label>
        <input
          name="date"
          type="date"
          required
          defaultValue={todayISO()}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Transaction"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600 dark:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
