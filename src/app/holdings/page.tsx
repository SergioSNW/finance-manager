export const dynamic = "force-dynamic";

import { getHoldings } from "@/server/queries/holdings";
import { getAccounts } from "@/server/queries/accounts";
import { HoldingTable } from "@/components/holding-table";
import { PortfolioAllocation } from "@/components/charts/portfolio-allocation";
import { EmptyState } from "@/components/empty-state";
import { AmountDisplay } from "@/components/amount-display";
import { CreateHoldingForm } from "./create-form";

export default function HoldingsPage() {
  const holdings = getHoldings();
  const investmentAccounts = getAccounts().filter(
    (a) => a.type === "investment"
  );

  const totalCost = holdings.reduce(
    (s, h) => s + h.shares * h.avgCostPerShare,
    0
  );
  const totalValue = holdings.reduce(
    (s, h) => s + h.shares * (h.currentPrice || h.avgCostPerShare),
    0
  );
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

  const allocationData = holdings.map((h) => ({
    symbol: h.symbol,
    value: h.shares * (h.currentPrice || h.avgCostPerShare),
  }));

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Holdings
        </h1>
        <CreateHoldingForm accounts={investmentAccounts} />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Total Value
          </p>
          <AmountDisplay cents={totalValue} className="text-xl font-bold" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Total Cost
          </p>
          <AmountDisplay cents={totalCost} className="text-xl font-bold" />
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
            Gain / Loss
          </p>
          <AmountDisplay cents={gainLoss} className="text-xl font-bold" />
          {totalCost > 0 && (
            <p className="mt-0.5 text-xs text-zinc-400">
              {gainLossPercent >= 0 ? "+" : ""}
              {gainLossPercent.toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <PortfolioAllocation data={allocationData} />
      </div>

      {holdings.length === 0 ? (
        <EmptyState
          title="No holdings yet"
          description="Add stocks, ETFs, or other investments to track your portfolio."
        />
      ) : (
        <HoldingTable holdings={holdings} />
      )}
    </div>
  );
}
