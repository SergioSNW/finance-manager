"use server";

import { getDb } from "@/lib/db";
import { budgets } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, nowISO } from "@/lib/format";
import { getPreviousBudget } from "@/server/queries/budgets";

export async function createBudget(formData: FormData) {
  const db = getDb();

  const categoryId = (formData.get("categoryId") as string) || null;
  const month = parseInt(formData.get("month") as string);
  const year = parseInt(formData.get("year") as string);
  const amountStr = formData.get("amount") as string;

  if (!month || !year || !amountStr) {
    return { error: "Month, year, and amount are required" };
  }

  const amountCents = Math.round(parseFloat(amountStr) * 100);
  if (isNaN(amountCents) || amountCents <= 0) {
    return { error: "Invalid amount" };
  }

  const previous = getPreviousBudget(categoryId, month, year);
  const rolloverCents = previous
    ? Math.max(0, previous.amountCents + previous.rolloverCents - getActualSpentForBudget(previous.id))
    : 0;

  db.insert(budgets)
    .values({
      id: generateId(),
      categoryId: categoryId || null,
      month,
      year,
      amountCents,
      rolloverCents,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    })
    .run();

  revalidatePath("/budgets");
  revalidatePath("/");
  return { success: true };
}

export async function updateBudget(id: string, formData: FormData) {
  const db = getDb();

  const amountStr = formData.get("amount") as string;
  if (!amountStr) return { error: "Amount is required" };

  const amountCents = Math.round(parseFloat(amountStr) * 100);
  if (isNaN(amountCents) || amountCents <= 0) {
    return { error: "Invalid amount" };
  }

  db.update(budgets)
    .set({ amountCents, updatedAt: nowISO() })
    .where(eq(budgets.id, id))
    .run();

  revalidatePath("/budgets");
  revalidatePath("/");
  return { success: true };
}

export async function deleteBudget(id: string) {
  const db = getDb();
  db.delete(budgets).where(eq(budgets.id, id)).run();

  revalidatePath("/budgets");
  revalidatePath("/");
  return { success: true };
}

function getActualSpentForBudget(budgetId: string): number {
  const db = getDb();
  const b = db.select().from(budgets).where(eq(budgets.id, budgetId)).get();
  if (!b) return 0;

  const { transactions } = require("@/server/db/schema");
  const { and, gte, lte, sql } = require("drizzle-orm");

  const monthStart = new Date(b.year, b.month - 1, 1).toISOString().slice(0, 10);
  const monthEnd = new Date(b.year, b.month, 0).toISOString().slice(0, 10);

  if (b.categoryId) {
    const result = db
      .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.categoryId, b.categoryId),
          gte(transactions.date, monthStart),
          lte(transactions.date, monthEnd),
          sql`${transactions.amount} < 0`
        )
      )
      .get();
    return Math.abs(result?.total || 0);
  }

  const result = db
    .select({ total: sql`COALESCE(SUM(${transactions.amount}), 0)` })
    .from(transactions)
    .where(
      and(
        gte(transactions.date, monthStart),
        lte(transactions.date, monthEnd),
        sql`${transactions.amount} < 0`
      )
    )
    .get();
  return Math.abs(result?.total || 0);
}
