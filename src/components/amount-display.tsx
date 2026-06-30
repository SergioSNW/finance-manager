import { formatCurrency, formatCurrencyCompact } from "@/lib/format";

export function AmountDisplay({
  cents,
  compact,
  className,
}: {
  cents: number;
  compact?: boolean;
  className?: string;
}) {
  const isNegative = cents < 0;
  const colorClass = cents === 0
    ? "text-zinc-500 dark:text-zinc-400"
    : isNegative
      ? "text-red-600 dark:text-red-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <span className={`font-mono tabular-nums ${colorClass} ${className || ""}`}>
      {compact ? formatCurrencyCompact(cents) : formatCurrency(cents)}
    </span>
  );
}
