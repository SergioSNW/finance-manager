import { getDb } from "@/lib/db";
import { budgets, categories, transactions } from "@/server/db/schema";
import { eq, and, sql, gte, lte } from "drizzle-orm";
import type { BudgetWithProgress } from "@/types/budget";

export async function getBudgets(month: number, year: number): Promise<BudgetWithProgress[]> {
  const db = await getDb();

  const rows = await db
    .select({
      id: budgets.id,
      categoryId: budgets.categoryId,
      month: budgets.month,
      year: budgets.year,
      amountCents: budgets.amountCents,
      rolloverCents: budgets.rolloverCents,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(budgets)
    .leftJoin(categories, eq(budgets.categoryId, categories.id))
    .where(and(eq(budgets.month, month), eq(budgets.year, year)))
    .all();

  const monthStart = new Date(year, month - 1, 1).toISOString().slice(0, 10);
  const monthEnd = new Date(year, month, 0).toISOString().slice(0, 10);

  const results = await Promise.all(rows.map(async (row) => {
    let actualSpent = 0;

    if (row.categoryId) {
      const result = await db
        .select({ total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
        .from(transactions)
        .where(
          and(
            eq(transactions.categoryId, row.categoryId),
            gte(transactions.date, monthStart),
            lte(transactions.date, monthEnd),
            sql`${transactions.amount} < 0`
          )
        )
        .get();
      actualSpent = Math.abs(result?.total || 0);
    } else {
      const result = await db
        .select({ total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)` })
        .from(transactions)
        .where(
          and(
            gte(transactions.date, monthStart),
            lte(transactions.date, monthEnd),
            sql`${transactions.amount} < 0`
          )
        )
        .get();
      actualSpent = Math.abs(result?.total || 0);
    }

    const available = row.amountCents + row.rolloverCents;
    const remaining = available - actualSpent;
    const percentage = available > 0 ? Math.min((actualSpent / available) * 100, 100) : 0;
    const status: "on_track" | "near_limit" | "exceeded" = percentage >= 100 ? "exceeded" : percentage >= 80 ? "near_limit" : "on_track";

    return {
      ...row,
      categoryName: row.categoryName ?? null,
      categoryColor: row.categoryColor ?? null,
      actualSpent,
      available,
      remaining,
      percentage,
      status,
    };
  }));

  return results;
}

export async function getBudget(id: string) {
  const db = await getDb();
  return await db.select().from(budgets).where(eq(budgets.id, id)).get();
}

export async function getGlobalBudget(month: number, year: number) {
  const db = await getDb();
  return await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.month, month), eq(budgets.year, year), sql`${budgets.categoryId} IS NULL`))
    .get();
}

export async function getCategoriesWithBudgets(month: number, year: number) {
  const rows = await getBudgets(month, year);
  return rows.filter((b) => b.categoryId !== null);
}

export async function getTotalSavings(): Promise<number> {
  const db = await getDb();
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${budgets.rolloverCents}), 0)` })
    .from(budgets)
    .where(sql`${budgets.rolloverCents} > 0`)
    .get();
  return result?.total || 0;
}

export async function getPreviousBudget(categoryId: string | null, month: number, year: number) {
  const db = await getDb();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  return await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.month, prevMonth),
        eq(budgets.year, prevYear),
        categoryId === null
          ? sql`${budgets.categoryId} IS NULL`
          : eq(budgets.categoryId, categoryId)
      )
    )
    .get();
}

export async function getAlertsForDashboard(): Promise<{ categoryName: string | null; status: string; percentage: number; budgetId: string }[]> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const all = await getBudgets(month, year);

  return all
    .filter((b) => b.status !== "on_track" && b.actualSpent > 0)
    .map((b) => ({
      categoryName: b.categoryName,
      status: b.status,
      percentage: b.percentage,
      budgetId: b.id,
    }));
}
