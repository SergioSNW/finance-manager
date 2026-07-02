import { AmountDisplay } from "./amount-display";
import Link from "next/link";

interface HoldingRow {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCostPerShare: number;
  currentPrice: number | null;
  accountName: string;
}

export function HoldingTable({
  holdings,
}: {
  holdings: HoldingRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <th className="px-3 py-2 sm:px-4 font-medium text-zinc-500">Symbol</th>
            <th className="hidden px-3 py-2 font-medium text-zinc-500 sm:table-cell sm:px-4">Name</th>
            <th className="hidden px-3 py-2 font-medium text-zinc-500 sm:table-cell sm:px-4">Account</th>
            <th className="px-3 py-2 sm:px-4 text-right font-medium text-zinc-500">
              Shares
            </th>
            <th className="px-3 py-2 sm:px-4 text-right font-medium text-zinc-500">
              Avg Cost
            </th>
            <th className="px-3 py-2 sm:px-4 text-right font-medium text-zinc-500">
              Current
            </th>
            <th className="px-3 py-2 sm:px-4 text-right font-medium text-zinc-500">
              Value
            </th>
            <th className="px-3 py-2 sm:px-4 text-right font-medium text-zinc-500">
              Gain/Loss
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const cost = h.shares * h.avgCostPerShare;
            const price = h.currentPrice || h.avgCostPerShare;
            const value = h.shares * price;
            const gain = value - cost;
            const gainPct =
              cost > 0 ? ((gain / cost) * 100).toFixed(1) : "0.0";

            return (
              <tr
                key={h.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30"
              >
                <td className="px-3 py-2.5 sm:px-4">
                  <Link
                    href={`/holdings/${h.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    {h.symbol}
                  </Link>
                </td>
                <td className="hidden px-3 py-2.5 text-zinc-900 dark:text-zinc-100 sm:table-cell sm:px-4">
                  {h.name}
                </td>
                <td className="hidden px-3 py-2.5 text-zinc-500 sm:table-cell sm:px-4">{h.accountName}</td>
                <td className="px-3 py-2.5 sm:px-4 text-right text-zinc-900 dark:text-zinc-100">
                  {h.shares.toFixed(3)}
                </td>
                <td className="px-3 py-2.5 sm:px-4 text-right">
                  <AmountDisplay cents={h.avgCostPerShare} />
                </td>
                <td className="px-3 py-2.5 sm:px-4 text-right">
                  <AmountDisplay cents={price} />
                </td>
                <td className="px-3 py-2.5 sm:px-4 text-right">
                  <AmountDisplay cents={Math.round(value)} />
                </td>
                <td className="px-3 py-2.5 sm:px-4 text-right">
                  <span
                    className={
                      gain >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    <AmountDisplay cents={Math.round(gain)} />
                    <span className="ml-1 text-xs">({gainPct}%)</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
