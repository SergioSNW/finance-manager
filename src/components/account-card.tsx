import Link from "next/link";
import { AmountDisplay } from "./amount-display";

const typeLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  investment: "Investment",
  cash: "Cash",
};

const typeIcons: Record<string, string> = {
  checking: "🏦",
  savings: "🐷",
  credit: "💳",
  investment: "📈",
  cash: "💵",
};

interface AccountCardProps {
  id: string;
  name: string;
  type: string;
  balance: number;
  isActive: boolean;
}

export function AccountCard({
  id,
  name,
  type,
  balance,
  isActive,
}: AccountCardProps) {
  return (
    <Link
      href={`/accounts/${id}`}
      className={`rounded-xl border p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
        isActive
          ? "border-zinc-200 dark:border-zinc-700"
          : "border-zinc-100 opacity-60 dark:border-zinc-800"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{typeIcons[type] || "🏦"}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {typeLabels[type] || type}
        </span>
      </div>
      <p className="mb-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {name}
      </p>
      <AmountDisplay cents={balance} className="text-lg font-bold" />
    </Link>
  );
}
