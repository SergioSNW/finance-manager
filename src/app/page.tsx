export const dynamic = "force-dynamic";

import { getAccounts } from "@/server/queries/accounts";
import { getRecentTransactions } from "@/server/queries/transactions";
import {
  getNetWorthHistory,
  getCashFlow,
  getSpendingByCategory,
} from "@/server/queries/dashboard";
import { getPortfolioValue } from "@/server/queries/holdings";
import { AccountCard } from "@/components/account-card";
import { NetWorthChart } from "@/components/charts/net-worth-chart";
import { CashFlowChart } from "@/components/charts/cash-flow-chart";
import { SpendingDonut } from "@/components/charts/spending-donut";
import { AmountDisplay } from "@/components/amount-display";
import { formatDate } from "@/lib/format";
import Link from "next/link";

export default function DashboardPage() {
  const accounts = getAccounts();
  const recent = getRecentTransactions(5);
  const portfolioValue = getPortfolioValue();

  const today = new Date();
  const netWorthHistory = getNetWorthHistory(12);
  const cashFlow = getCashFlow(6);
  const spending = getSpendingByCategory(
    today.getFullYear(),
    today.getMonth() + 1
  );

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const netWorth = totalBalance + portfolioValue;
  const currentNetWorth = netWorthHistory[netWorthHistory.length - 1]?.netWorth || 0;

  return (
    <div className="p-4 lg:p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Dashboard
      </h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Net Worth"
          value={netWorth}
          subtitle="Total assets + holdings"
        />
        <SummaryCard
          title="Cash Balance"
          value={totalBalance}
          subtitle="All accounts"
        />
        <SummaryCard
          title="Portfolio"
          value={portfolioValue}
          subtitle="Investments"
        />
        <SummaryCard
          title="Accounts"
          value={accounts.length}
          subtitle="Active accounts"
          isCount
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <NetWorthChart data={netWorthHistory} />
        <CashFlowChart data={cashFlow} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <SpendingDonut data={spending} />
        <div>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Accounts
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {accounts
              .filter((a) => a.isActive)
              .map((a) => (
                <AccountCard key={a.id} {...a} />
              ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Transactions
          </h2>
          <Link
            href="/transactions"
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <th className="px-4 py-2 font-medium text-zinc-500">Date</th>
                <th className="px-4 py-2 font-medium text-zinc-500">Description</th>
                <th className="px-4 py-2 font-medium text-zinc-500">Account</th>
                <th className="px-4 py-2 text-right font-medium text-zinc-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-zinc-400"
                  >
                    No transactions yet
                  </td>
                </tr>
              ) : (
                recent.map((tx) => (
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
                    <td className="px-4 py-2.5 text-zinc-500">
                      {tx.accountName}
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
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  isCount,
}: {
  title: string;
  value: number;
  subtitle: string;
  isCount?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
        {title}
      </p>
      {isCount ? (
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {value}
        </p>
      ) : (
        <AmountDisplay
          cents={value}
          className="text-2xl font-bold"
        />
      )}
      <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>
    </div>
  );
}
