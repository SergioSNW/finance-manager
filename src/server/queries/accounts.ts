import { getDb } from "@/lib/db";
import { accounts, transactions } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export function getAccounts() {
  const db = getDb();
  return db
    .select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,
      currency: accounts.currency,
      isActive: accounts.isActive,
      createdAt: accounts.createdAt,
      updatedAt: accounts.updatedAt,
      balance: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(accounts)
    .leftJoin(transactions, eq(accounts.id, transactions.accountId))
    .groupBy(accounts.id)
    .orderBy(accounts.name)
    .all();
}

export function getAccountById(id: string) {
  const db = getDb();
  const rows = db
    .select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,
      currency: accounts.currency,
      isActive: accounts.isActive,
      createdAt: accounts.createdAt,
      updatedAt: accounts.updatedAt,
      balance: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(accounts)
    .leftJoin(transactions, eq(accounts.id, transactions.accountId))
    .where(eq(accounts.id, id))
    .groupBy(accounts.id)
    .all();

  return rows[0] || null;
}

export function getAccount(id: string) {
  const db = getDb();
  return db.select().from(accounts).where(eq(accounts.id, id)).get() || null;
}

export function getAccountBalance(accountId: string): number {
  const db = getDb();
  const result = db
    .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(transactions)
    .where(eq(transactions.accountId, accountId))
    .get();
  return result?.total || 0;
}
