import { getDb } from "@/lib/db";
import { categories } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";

export function getCategories() {
  const db = getDb();
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.type), asc(categories.name))
    .all();
}

export function getCategory(id: string) {
  const db = getDb();
  return db.select().from(categories).where(eq(categories.id, id)).get() || null;
}

export function getCategoriesByType(type: string) {
  const db = getDb();
  return db
    .select()
    .from(categories)
    .where(eq(categories.type, type as any))
    .orderBy(asc(categories.name))
    .all();
}
