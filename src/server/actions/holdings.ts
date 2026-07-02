"use server";

import { getDb } from "@/lib/db";
import { holdings, holdingTransactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, nowISO, centsFromDecimal } from "@/lib/format";

export async function createHolding(formData: FormData) {
  const db = await getDb();

  const accountId = formData.get("accountId") as string;
  const symbol = formData.get("symbol") as string;
  const name = formData.get("name") as string;
  const sharesStr = formData.get("shares") as string;
  const priceStr = formData.get("avgCostPerShare") as string;

  if (!accountId || !symbol || !name || !sharesStr || !priceStr) {
    return { error: "All fields are required" };
  }

  const shares = parseFloat(sharesStr);
  const avgCostPerShare = centsFromDecimal(parseFloat(priceStr));

  if (isNaN(shares) || isNaN(avgCostPerShare)) {
    return { error: "Invalid shares or price" };
  }

  const holdingId = generateId();
  await db.insert(holdings)
    .values({
      id: holdingId,
      accountId,
      symbol: symbol.toUpperCase(),
      name,
      shares,
      avgCostPerShare,
      currentPrice: avgCostPerShare,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    })
    .run();

  await db.insert(holdingTransactions)
    .values({
      id: generateId(),
      holdingId,
      type: "buy",
      shares,
      pricePerShare: avgCostPerShare,
      date: nowISO().slice(0, 10),
      createdAt: nowISO(),
    })
    .run();

  revalidatePath("/holdings");
  revalidatePath("/");
  return { success: true };
}

export async function updateHoldingPrice(id: string, formData: FormData) {
  const db = await getDb();

  const priceStr = formData.get("currentPrice") as string;
  if (!priceStr) return { error: "Price is required" };

  const currentPrice = centsFromDecimal(parseFloat(priceStr));
  if (isNaN(currentPrice)) return { error: "Invalid price" };

  await db.update(holdings)
    .set({ currentPrice, updatedAt: nowISO() })
    .where(eq(holdings.id, id))
    .run();

  revalidatePath("/holdings");
  revalidatePath(`/holdings/${id}`);
  revalidatePath("/");
  return { success: true };
}

export async function addBuyTransaction(holdingId: string, formData: FormData) {
  const db = await getDb();

  const sharesStr = formData.get("shares") as string;
  const priceStr = formData.get("pricePerShare") as string;
  const date = formData.get("date") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!sharesStr || !priceStr || !date) {
    return { error: "Shares, price, and date are required" };
  }

  const shares = parseFloat(sharesStr);
  const pricePerShare = centsFromDecimal(parseFloat(priceStr));

  if (isNaN(shares) || isNaN(pricePerShare)) {
    return { error: "Invalid shares or price" };
  }

  await db.insert(holdingTransactions)
    .values({
      id: generateId(),
      holdingId,
      type: "buy",
      shares,
      pricePerShare,
      date,
      notes,
      createdAt: nowISO(),
    })
    .run();

  const h = await db.select().from(holdings).where(eq(holdings.id, holdingId)).get();
  if (!h) return { error: "Holding not found" };
  const totalCost = h.avgCostPerShare * h.shares + pricePerShare * shares;
  const totalShares = h.shares + shares;
  const newAvg = Math.round(totalCost / totalShares);

  await db.update(holdings)
    .set({
      shares: totalShares,
      avgCostPerShare: newAvg,
      updatedAt: nowISO(),
    })
    .where(eq(holdings.id, holdingId))
    .run();

  revalidatePath("/holdings");
  revalidatePath(`/holdings/${holdingId}`);
  revalidatePath("/");
  return { success: true };
}

export async function addSellTransaction(
  holdingId: string,
  formData: FormData
) {
  const db = await getDb();

  const sharesStr = formData.get("shares") as string;
  const priceStr = formData.get("pricePerShare") as string;
  const date = formData.get("date") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!sharesStr || !priceStr || !date) {
    return { error: "Shares, price, and date are required" };
  }

  const shares = parseFloat(sharesStr);
  const pricePerShare = centsFromDecimal(parseFloat(priceStr));

  if (isNaN(shares) || isNaN(pricePerShare)) {
    return { error: "Invalid shares or price" };
  }

  const h = await db.select().from(holdings).where(eq(holdings.id, holdingId)).get();
  if (!h) return { error: "Holding not found" };
  if (shares > h.shares) {
    return { error: "Cannot sell more shares than owned" };
  }

  await db.insert(holdingTransactions)
    .values({
      id: generateId(),
      holdingId,
      type: "sell",
      shares,
      pricePerShare,
      date,
      notes,
      createdAt: nowISO(),
    })
    .run();

  await db.update(holdings)
    .set({
      shares: h.shares - shares,
      updatedAt: nowISO(),
    })
    .where(eq(holdings.id, holdingId))
    .run();

  revalidatePath("/holdings");
  revalidatePath(`/holdings/${holdingId}`);
  revalidatePath("/");
  return { success: true };
}
