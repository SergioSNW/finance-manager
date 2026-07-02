import { getDb } from "@/lib/db";
import { holdings, accounts, holdingTransactions } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getHoldings() {
  const db = await getDb();
  return await db
    .select({
      id: holdings.id,
      accountId: holdings.accountId,
      symbol: holdings.symbol,
      name: holdings.name,
      shares: holdings.shares,
      avgCostPerShare: holdings.avgCostPerShare,
      currentPrice: holdings.currentPrice,
      createdAt: holdings.createdAt,
      updatedAt: holdings.updatedAt,
      accountName: accounts.name,
    })
    .from(holdings)
    .innerJoin(accounts, eq(holdings.accountId, accounts.id))
    .orderBy(asc(holdings.symbol))
    .all();
}

export async function getHolding(id: string) {
  const db = await getDb();
  return await db
    .select({
      id: holdings.id,
      accountId: holdings.accountId,
      symbol: holdings.symbol,
      name: holdings.name,
      shares: holdings.shares,
      avgCostPerShare: holdings.avgCostPerShare,
      currentPrice: holdings.currentPrice,
      createdAt: holdings.createdAt,
      updatedAt: holdings.updatedAt,
      accountName: accounts.name,
    })
    .from(holdings)
    .innerJoin(accounts, eq(holdings.accountId, accounts.id))
    .where(eq(holdings.id, id))
    .get() || null;
}

export async function getHoldingTransactions(holdingId: string) {
  const db = await getDb();
  return await db
    .select()
    .from(holdingTransactions)
    .where(eq(holdingTransactions.holdingId, holdingId))
    .orderBy(asc(holdingTransactions.date))
    .all();
}

export async function getPortfolioValue() {
  const all = await getHoldings();
  return all.reduce((sum, h) => {
    const price = h.currentPrice || h.avgCostPerShare;
    return sum + h.shares * price;
  }, 0);
}
