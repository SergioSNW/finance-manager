"use server";

import { getDb } from "@/lib/db";
import { accounts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, nowISO } from "@/lib/format";

export async function createAccount(formData: FormData) {
  const db = await getDb();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const currency = (formData.get("currency") as string) || "USD";

  if (!name || !type) {
    return { error: "Name and type are required" };
  }

  const validTypes = ["checking", "savings", "credit", "investment", "cash"];
  if (!validTypes.includes(type)) {
    return { error: "Invalid account type" };
  }

  await db.insert(accounts)
    .values({
      id: generateId(),
      name,
      type: type as "checking" | "savings" | "credit" | "investment" | "cash",
      currency,
      isActive: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    })
    .run();

  revalidatePath("/accounts");
  revalidatePath("/");
  return { success: true };
}

export async function updateAccount(id: string, formData: FormData) {
  const db = await getDb();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;

  if (!name || !type) {
    return { error: "Name and type are required" };
  }

  await db.update(accounts)
    .set({ name, type: type as "checking" | "savings" | "credit" | "investment" | "cash", updatedAt: nowISO() })
    .where(eq(accounts.id, id))
    .run();

  revalidatePath("/accounts");
  revalidatePath(`/accounts/${id}`);
  revalidatePath("/");
  return { success: true };
}

export async function toggleAccountActive(id: string) {
  const db = await getDb();
  const account = await db.select().from(accounts).where(eq(accounts.id, id)).get();
  if (!account) return { error: "Account not found" };

  await db.update(accounts)
    .set({ isActive: !account.isActive, updatedAt: nowISO() })
    .where(eq(accounts.id, id))
    .run();

  revalidatePath("/accounts");
  revalidatePath("/");
  return { success: true };
}
