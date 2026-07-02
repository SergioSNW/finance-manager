import { getDb } from "@/lib/db";
import { accounts, transactions } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getAccounts() {
  const db = await getDb();
  return await db
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

export async function getAccountById(id: string) {
  const db = await getDb();
  const rows = await db
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

export async function getAccount(id: string) {
  const db = await getDb();
  return await db.select().from(accounts).where(eq(accounts.id, id)).get() || null;
}

export async function getAccountBalance(accountId: string): Promise<number> {
  const db = await getDb();
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(transactions)
    .where(eq(transactions.accountId, accountId))
    .get();
  return result?.total || 0;
}
