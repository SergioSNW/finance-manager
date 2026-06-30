import { getDb } from "@/lib/db";
import { transactions, categories } from "@/server/db/schema";
import { eq, sql, and, gte, lte } from "drizzle-orm";

export interface NetWorthPoint {
  month: string;
  netWorth: number;
}

export interface CashFlowPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface SpendingByCategory {
  categoryName: string | null;
  categoryColor: string | null;
  total: number;
}

export function getNetWorthHistory(months = 12): NetWorthPoint[] {
  const db = getDb();
  const points: NetWorthPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const monthLabel = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const result = db
      .select({
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(lte(transactions.date, monthStart))
      .get();

    const { getPortfolioValue } = require("./holdings");
    const totalTransactions = result?.total || 0;
    const portfolioValue = getPortfolioValue();

    points.push({
      month: monthLabel,
      netWorth: totalTransactions + portfolioValue,
    });
  }

  return points;
}

export function getCashFlow(months = 6): CashFlowPoint[] {
  const db = getDb();
  const points: CashFlowPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthStart = new Date(year, month, 1).toISOString().slice(0, 10);
    const monthEnd = new Date(year, month + 1, 0).toISOString().slice(0, 10);
    const monthLabel = `${year}-${String(month + 1).padStart(2, "0")}`;

    const income = db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(transactions)
      .where(
        and(
          gte(transactions.date, monthStart),
          lte(transactions.date, monthEnd),
          sql`amount > 0`
        )
      )
      .get();

    const expenses = db
      .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
      .from(transactions)
      .where(
        and(
          gte(transactions.date, monthStart),
          lte(transactions.date, monthEnd),
          sql`amount < 0`
        )
      )
      .get();

    points.push({
      month: monthLabel,
      income: income?.total || 0,
      expenses: Math.abs(expenses?.total || 0),
    });
  }

  return points;
}

export function getSpendingByCategory(
  year: number,
  month: number
): SpendingByCategory[] {
  const db = getDb();
  const monthStart = new Date(year, month - 1, 1).toISOString().slice(0, 10);
  const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10);

  return db
    .select({
      categoryName: categories.name,
      categoryColor: categories.color,
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        gte(transactions.date, monthStart),
        lte(transactions.date, monthEnd),
        sql`${transactions.amount} < 0`
      )
    )
    .groupBy(transactions.categoryId)
    .orderBy(sql`SUM(${transactions.amount})`)
    .all();
}
