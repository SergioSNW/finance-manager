"use client";

import { useState } from "react";
import { AmountDisplay } from "./amount-display";
import { formatDate } from "@/lib/format";
import { deleteTransaction } from "@/server/actions/transactions";
import type { TransactionWithAccount } from "@/types";

export function TransactionTable({
  transactions,
}: {
  transactions: TransactionWithAccount[];
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this transaction?")) return;
    setDeleting(id);
    await deleteTransaction(id);
    setDeleting(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <th className="px-3 py-2 font-medium text-zinc-500 sm:px-4">Date</th>
            <th className="px-3 py-2 font-medium text-zinc-500 sm:px-4">Description</th>
            <th className="hidden px-3 py-2 font-medium text-zinc-500 sm:table-cell sm:px-4">Account</th>
            <th className="hidden px-3 py-2 font-medium text-zinc-500 sm:table-cell sm:px-4">Category</th>
            <th className="px-3 py-2 text-right font-medium text-zinc-500 sm:px-4">
              Amount
            </th>
            <th className="px-3 py-2 font-medium text-zinc-500 sm:px-4"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
            >
              <td className="px-3 py-2.5 text-zinc-500 sm:px-4">
                {formatDate(tx.date)}
              </td>
              <td className="px-3 py-2.5 text-zinc-900 dark:text-zinc-100 sm:px-4">
                {tx.description}
              </td>
              <td className="hidden px-3 py-2.5 text-zinc-500 sm:table-cell sm:px-4">{tx.accountName}</td>
              <td className="hidden px-3 py-2.5 sm:table-cell sm:px-4">
                {tx.categoryName ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: (tx.categoryColor || "#6366f1") + "20",
                      color: tx.categoryColor || "#6366f1",
                    }}
                  >
                    {tx.categoryName}
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2.5 text-right sm:px-4">
                <AmountDisplay cents={tx.amount} />
              </td>
              <td className="px-3 py-2.5 sm:px-4">
                <button
                  onClick={() => handleDelete(tx.id)}
                  disabled={deleting === tx.id}
                  className="cursor-pointer text-xs text-red-500 hover:text-red-400 disabled:opacity-50"
                >
                  {deleting === tx.id ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
