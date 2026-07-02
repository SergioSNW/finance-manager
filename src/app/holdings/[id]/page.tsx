import { notFound } from "next/navigation";
import {
  getHolding,
  getHoldingTransactions,
} from "@/server/queries/holdings";
import { AmountDisplay } from "@/components/amount-display";
import { formatDate } from "@/lib/format";
import Link from "next/link";

export default async function HoldingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const holding = await getHolding(id);
  if (!holding) notFound();

  const txs = await getHoldingTransactions(id);
  const price = holding.currentPrice || holding.avgCostPerShare;
  const value = holding.shares * price;
  const cost = holding.shares * holding.avgCostPerShare;
  const gain = value - cost;
  const gainPct = cost > 0 ? ((gain / cost) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-4 lg:p-6">
      <Link
        href="/holdings"
        className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        &larr; Holdings
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {holding.symbol}
        </h1>
        <p className="text-sm text-zinc-500">{holding.name}</p>
        <p className="mt-1 text-xs text-zinc-400">Account: {holding.accountName}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Shares
          </p>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {holding.shares.toFixed(4)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Avg Cost
          </p>
          <AmountDisplay cents={holding.avgCostPerShare} className="text-xl font-bold" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Current Price
          </p>
          <AmountDisplay cents={price} className="text-xl font-bold" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            P&amp;L
          </p>
          <AmountDisplay cents={Math.round(gain)} className="text-xl font-bold" />
          <p className="mt-0.5 text-xs text-zinc-400">
            {gain >= 0 ? "+" : ""}
            {gainPct}%
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
              <th className="px-4 py-2 font-medium text-zinc-500">Date</th>
              <th className="px-4 py-2 font-medium text-zinc-500">Type</th>
              <th className="px-4 py-2 text-right font-medium text-zinc-500">
                Shares
              </th>
              <th className="px-4 py-2 text-right font-medium text-zinc-500">
                Price
              </th>
              <th className="px-4 py-2 text-right font-medium text-zinc-500">
                Total
              </th>
              <th className="px-4 py-2 font-medium text-zinc-500">Notes</th>
            </tr>
          </thead>
          <tbody>
            {txs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  No transactions recorded
                </td>
              </tr>
            ) : (
              txs.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="px-4 py-2.5 text-zinc-500">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        tx.type === "buy"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-zinc-900 dark:text-zinc-100">
                    {tx.shares.toFixed(4)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <AmountDisplay cents={tx.pricePerShare} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <AmountDisplay
                      cents={Math.round(tx.shares * tx.pricePerShare)}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-zinc-400">
                    {tx.notes || "-"}
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
