"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/format";

interface Props {
  data: { symbol: string; value: number }[];
}

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#06b6d4",
  "#ef4444",
  "#8b5cf6",
  "#eab308",
];

export function PortfolioAllocation({ data }: Props) {
  const chartData = data
    .filter((d) => d.value > 0)
    .map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
        <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Portfolio Allocation
        </h3>
        <p className="text-sm text-zinc-400">No holdings with value</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Portfolio Allocation
      </h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="symbol"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
