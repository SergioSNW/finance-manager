"use server";

import { getDb } from "@/lib/db";
import { transactions } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, nowISO, centsFromDecimal } from "@/lib/format";

export interface CsvRow {
  date: string;
  description: string;
  amount: number;
  categoryName?: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

function normalizeDate(val: string): string | null {
  if (!val) return null;
  const clean = val.trim();

  const m1 = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m1) {
    const d = new Date(+m1[1], +m1[2] - 1, +m1[3]);
    return d.toISOString().slice(0, 10);
  }

  const m2 = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m2) {
    const d = new Date(+m2[3], +m2[1] - 1, +m2[2]);
    return d.toISOString().slice(0, 10);
  }

  const m3 = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (m3) {
    const year = 2000 + +m3[3];
    const d = new Date(year, +m3[1] - 1, +m3[2]);
    return d.toISOString().slice(0, 10);
  }

  return null;
}

export async function importCsv(data: {
  rows: CsvRow[];
  accountId: string;
  categoryId?: string;
}) {
  const db = await getDb();
  const result: ImportResult = { imported: 0, skipped: 0, errors: [] };

  for (const row of data.rows) {
    try {
      const date = normalizeDate(row.date);
      if (!date) {
        result.errors.push(`Invalid date: "${row.date}"`);
        continue;
      }

      const amount = centsFromDecimal(row.amount);
      if (isNaN(amount) || amount === 0) {
        result.errors.push(`Invalid amount: "${row.amount}"`);
        continue;
      }

      if (!row.description || !row.description.trim()) {
        result.errors.push(`Missing description for row with date ${row.date}`);
        continue;
      }

      const existing = await db
        .select({ id: transactions.id })
        .from(transactions)
        .where(
          and(
            eq(transactions.date, date),
            eq(transactions.amount, amount),
            eq(transactions.description, row.description.trim())
          )
        )
        .get();

      if (existing) {
        result.skipped++;
        continue;
      }

      await db.insert(transactions)
        .values({
          id: generateId(),
          accountId: data.accountId,
          amount,
          description: row.description.trim(),
          categoryId: data.categoryId || null,
          date,
          isReconciled: false,
          createdAt: nowISO(),
          updatedAt: nowISO(),
        })
        .run();

      result.imported++;
    } catch (e: unknown) {
      result.errors.push(e instanceof Error ? e.message : "Unknown error");
    }
  }

  revalidatePath("/transactions");
  revalidatePath("/");
  return result;
}
