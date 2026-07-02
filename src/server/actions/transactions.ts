"use server";

import { getDb } from "@/lib/db";
import { transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, nowISO, centsFromDecimal } from "@/lib/format";

export async function createTransaction(formData: FormData) {
  const db = await getDb();

  const accountId = formData.get("accountId") as string;
  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  const date = formData.get("date") as string;
  const type = formData.get("type") as string;

  if (!accountId || !amountStr || !description || !date) {
    return { error: "Account, amount, description, and date are required" };
  }

  let amount = centsFromDecimal(parseFloat(amountStr));
  if (isNaN(amount)) return { error: "Invalid amount" };

  if (type === "expense" || type === "withdrawal") {
    amount = -Math.abs(amount);
  } else {
    amount = Math.abs(amount);
  }

  await db.insert(transactions)
    .values({
      id: generateId(),
      accountId,
      amount,
      description,
      categoryId: categoryId || null,
      date,
      isReconciled: false,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    })
    .run();

  revalidatePath("/transactions");
  revalidatePath(`/accounts/${accountId}`);
  revalidatePath("/");
  return { success: true };
}

export async function updateTransaction(id: string, formData: FormData) {
  const db = await getDb();

  const amountStr = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  const date = formData.get("date") as string;

  if (!amountStr || !description || !date) {
    return { error: "Amount, description, and date are required" };
  }

  const amount = centsFromDecimal(parseFloat(amountStr));
  if (isNaN(amount)) return { error: "Invalid amount" };

  await db.update(transactions)
    .set({
      amount,
      description,
      categoryId: categoryId || null,
      date,
      updatedAt: nowISO(),
    })
    .where(eq(transactions.id, id))
    .run();

  revalidatePath("/transactions");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const db = await getDb();
  const tx = await db.select().from(transactions).where(eq(transactions.id, id)).get();
  if (!tx) return { error: "Transaction not found" };

  await db.delete(transactions).where(eq(transactions.id, id)).run();

  revalidatePath("/transactions");
  revalidatePath(`/accounts/${tx.accountId}`);
  revalidatePath("/");
  return { success: true };
}

export async function toggleReconciled(id: string) {
  const db = await getDb();
  const tx = await db.select().from(transactions).where(eq(transactions.id, id)).get();
  if (!tx) return { error: "Transaction not found" };

  await db.update(transactions)
    .set({ isReconciled: !tx.isReconciled, updatedAt: nowISO() })
    .where(eq(transactions.id, id))
    .run();

  revalidatePath("/transactions");
  revalidatePath("/");
  return { success: true };
}
