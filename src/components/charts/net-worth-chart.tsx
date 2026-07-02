"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/format";

interface Props {
  data: { month: string; netWorth: number }[];
}

export function NetWorthChart({ data }: Props) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-950">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Net Worth
      </h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="stroke-zinc-200 dark:stroke-zinc-700"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="text-zinc-400"
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(Number(v))}
              tick={{ fontSize: 12 }}
              className="text-zinc-400"
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
              }}
            />
            <defs>
              <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="#6366f1"
              fill="url(#netWorthGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
