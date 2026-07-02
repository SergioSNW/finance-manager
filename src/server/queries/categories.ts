import { getDb } from "@/lib/db";
import { categories } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getCategories() {
  const db = await getDb();
  return await db
    .select()
    .from(categories)
    .orderBy(asc(categories.type), asc(categories.name))
    .all();
}

export async function getCategory(id: string) {
  const db = await getDb();
  return await db.select().from(categories).where(eq(categories.id, id)).get() || null;
}

export async function getCategoriesByType(type: "income" | "expense" | "transfer") {
  const db = await getDb();
  return await db
    .select()
    .from(categories)
    .where(eq(categories.type, type))
    .orderBy(asc(categories.name))
    .all();
}
