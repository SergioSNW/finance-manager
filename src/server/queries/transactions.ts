import { getDb } from "@/lib/db";
import { transactions, accounts, categories } from "@/server/db/schema";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export async function getTransactions(filters?: TransactionFilters) {
  const db = await getDb();

  const conditions = [];
  if (filters?.accountId) conditions.push(eq(transactions.accountId, filters.accountId));
  if (filters?.categoryId) conditions.push(eq(transactions.categoryId, filters.categoryId));
  if (filters?.dateFrom) conditions.push(gte(transactions.date, filters.dateFrom));
  if (filters?.dateTo) conditions.push(lte(transactions.date, filters.dateTo));
  if (filters?.search) {
    conditions.push(sql`${transactions.description} LIKE ${`%${filters.search}%`}`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return await db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      amount: transactions.amount,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isReconciled: transactions.isReconciled,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      accountName: accounts.name,
      accountType: accounts.type,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(where)
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .all();
}

export async function getTransaction(id: string) {
  const db = await getDb();
  return await db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      amount: transactions.amount,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isReconciled: transactions.isReconciled,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      accountName: accounts.name,
      accountType: accounts.type,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.id, id))
    .get() || null;
}

export async function getRecentTransactions(limit = 5) {
  const db = await getDb();
  return await db
    .select({
      id: transactions.id,
      accountId: transactions.accountId,
      amount: transactions.amount,
      description: transactions.description,
      categoryId: transactions.categoryId,
      date: transactions.date,
      isReconciled: transactions.isReconciled,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      accountName: accounts.name,
      accountType: accounts.type,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .limit(limit)
    .all();
}
