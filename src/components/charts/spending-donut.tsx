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
  data: { categoryName: string | null; categoryColor: string | null; total: number }[];
}

const COLORS = [
  "#6366f1",
  "#f97316",
  "#ef4444",
  "#22c55e",
  "#06b6d4",
  "#eab308",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#78716c",
];

export function SpendingDonut({ data }: Props) {
  const sorted = [...data]
    .map((d) => ({
      name: d.categoryName || "Uncategorized",
      value: Math.abs(d.total),
      color: d.categoryColor || COLORS[0],
    }))
    .sort((a, b) => b.value - a.value);

  const top5 = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const restTotal = rest.reduce((s, d) => s + d.value, 0);
  const chartData =
    restTotal > 0
      ? [...top5, { name: "Other", value: restTotal, color: "#a1a1aa" }]
      : top5;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Spending by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
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
            <Legend
              formatter={(value: string) => (
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
