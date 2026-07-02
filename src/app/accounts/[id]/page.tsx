import { notFound } from "next/navigation";
import { getAccount, getAccountBalance } from "@/server/queries/accounts";
import { getTransactions } from "@/server/queries/transactions";
import { AmountDisplay } from "@/components/amount-display";
import { BalanceHistoryChart } from "@/components/charts/balance-history";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { getNetWorthHistory } from "@/server/queries/dashboard";

const typeLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  investment: "Investment",
  cash: "Cash",
};

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = await getAccount(id);
  if (!account) notFound();

  const balance = await getAccountBalance(id);
  const transactions = await getTransactions({ accountId: id });

  const history = (await getNetWorthHistory(12)).map((p) => ({
    month: p.month,
    balance: p.netWorth,
  }));

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <Link
          href="/accounts"
          className="mb-2 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          &larr; Accounts
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {account.name}
            </h1>
            <p className="text-sm text-zinc-500">
              {typeLabels[account.type] || account.type}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400">Balance</p>
            <AmountDisplay
              cents={balance}
              className="text-2xl font-bold"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <BalanceHistoryChart data={history} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
              <th className="px-4 py-2 font-medium text-zinc-500">Date</th>
              <th className="px-4 py-2 font-medium text-zinc-500">Description</th>
              <th className="px-4 py-2 font-medium text-zinc-500">Category</th>
              <th className="px-4 py-2 text-right font-medium text-zinc-500">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  No transactions for this account
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="px-4 py-2.5 text-zinc-500">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-900 dark:text-zinc-100">
                    {tx.description}
                  </td>
                  <td className="px-4 py-2.5">
                    {tx.categoryName && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: (tx.categoryColor || "#6366f1") + "20",
                          color: tx.categoryColor || "#6366f1",
                        }}
                      >
                        {tx.categoryName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <AmountDisplay cents={tx.amount} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
