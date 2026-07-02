import { getDb } from "@/lib/db";
import { transactions, categories } from "@/server/db/schema";
import { eq, sql, and, gte, lte } from "drizzle-orm";
import { getPortfolioValue } from "./holdings";

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

export async function getNetWorthHistory(months = 12): Promise<NetWorthPoint[]> {
  const db = await getDb();
  const points: NetWorthPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .slice(0, 10);
    const monthLabel = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      })
      .from(transactions)
      .where(lte(transactions.date, monthStart))
      .get();

    const totalTransactions = result?.total || 0;
    const portfolioValue = await getPortfolioValue();

    points.push({
      month: monthLabel,
      netWorth: totalTransactions + portfolioValue,
    });
  }

  return points;
}

export async function getCashFlow(months = 6): Promise<CashFlowPoint[]> {
  const db = await getDb();
  const points: CashFlowPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthStart = new Date(year, month, 1).toISOString().slice(0, 10);
    const monthEnd = new Date(year, month + 1, 0).toISOString().slice(0, 10);
    const monthLabel = `${year}-${String(month + 1).padStart(2, "0")}`;

    const income = await db
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

    const expenses = await db
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

export async function getSpendingByCategory(
  year: number,
  month: number
): Promise<SpendingByCategory[]> {
  const db = await getDb();
  const monthStart = new Date(year, month - 1, 1).toISOString().slice(0, 10);
  const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10);

  return await db
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
