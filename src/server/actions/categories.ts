"use server";

import { getDb } from "@/lib/db";
import { categories, transactions } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, nowISO } from "@/lib/format";

export async function createCategory(formData: FormData) {
  const db = getDb();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const color = (formData.get("color") as string) || "#6366f1";

  if (!name || !type) {
    return { error: "Name and type are required" };
  }

  if (!["income", "expense", "transfer"].includes(type)) {
    return { error: "Invalid category type" };
  }

  db.insert(categories)
    .values({
      id: generateId(),
      name,
      type: type as any,
      color,
      createdAt: nowISO(),
    })
    .run();

  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const db = getDb();

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  if (!name) return { error: "Name is required" };

  db.update(categories)
    .set({ name, color: color || "#6366f1" })
    .where(eq(categories.id, id))
    .run();

  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const db = getDb();

  const result = db
    .select({ count: sql<number>`COUNT(*)` })
    .from(transactions)
    .where(eq(transactions.categoryId, id))
    .get();

  if ((result?.count || 0) > 0) {
    return { error: "Cannot delete a category that has transactions" };
  }

  db.delete(categories).where(eq(categories.id, id)).run();

  revalidatePath("/categories");
  revalidatePath("/");
  return { success: true };
}
