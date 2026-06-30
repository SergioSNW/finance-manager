import { getDb } from "@/lib/db";
import { holdings, accounts } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";

export function getHoldings() {
  const db = getDb();
  return db
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

export function getHolding(id: string) {
  const db = getDb();
  return db
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

export function getHoldingTransactions(holdingId: string) {
  const db = getDb();
  const { holdingTransactions } = require("@/server/db/schema");
  return db
    .select()
    .from(holdingTransactions)
    .where(eq(holdingTransactions.holdingId, holdingId))
    .orderBy(asc(holdingTransactions.date))
    .all();
}

export function getPortfolioValue() {
  const db = getDb();
  const all = getHoldings();
  return all.reduce((sum, h) => {
    const price = h.currentPrice || h.avgCostPerShare;
    return sum + h.shares * price;
  }, 0);
}
