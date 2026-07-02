import { getDb } from "@/lib/db";
import { accounts, categories, transactions, holdings, holdingTransactions, budgets } from "./schema";
import { generateId, nowISO, centsFromDecimal } from "@/lib/format";

export async function seed() {
  const db = await getDb();

  await db.transaction(async (tx) => {
    const existing = await tx.select().from(accounts).all();
    if (existing.length > 0) return;

    const accChecking = {
      id: generateId(), name: "Checking", type: "checking" as const,
      currency: "USD", isActive: true, createdAt: nowISO(), updatedAt: nowISO(),
    };
    const accSavings = {
      id: generateId(), name: "Savings", type: "savings" as const,
      currency: "USD", isActive: true, createdAt: nowISO(), updatedAt: nowISO(),
    };
    const accCredit = {
      id: generateId(), name: "Credit Card", type: "credit" as const,
      currency: "USD", isActive: true, createdAt: nowISO(), updatedAt: nowISO(),
    };
    const accInvestment = {
      id: generateId(), name: "Brokerage", type: "investment" as const,
      currency: "USD", isActive: true, createdAt: nowISO(), updatedAt: nowISO(),
    };

    await tx.insert(accounts).values([accChecking, accSavings, accCredit, accInvestment]).run();

    const catIncome = { id: generateId(), name: "Salary", type: "income" as const, color: "#22c55e", icon: "briefcase", parentId: null, createdAt: nowISO() };
    const catFreelance = { id: generateId(), name: "Freelance", type: "income" as const, color: "#16a34a", icon: "code", parentId: null, createdAt: nowISO() };
    const catGroceries = { id: generateId(), name: "Groceries", type: "expense" as const, color: "#f97316", icon: "shopping-cart", parentId: null, createdAt: nowISO() };
    const catDining = { id: generateId(), name: "Dining", type: "expense" as const, color: "#ef4444", icon: "utensils", parentId: null, createdAt: nowISO() };
    const catRent = { id: generateId(), name: "Rent", type: "expense" as const, color: "#8b5cf6", icon: "home", parentId: null, createdAt: nowISO() };
    const catTransport = { id: generateId(), name: "Transport", type: "expense" as const, color: "#06b6d4", icon: "car", parentId: null, createdAt: nowISO() };
    const catUtilities = { id: generateId(), name: "Utilities", type: "expense" as const, color: "#eab308", icon: "zap", parentId: null, createdAt: nowISO() };
    const catEntertainment = { id: generateId(), name: "Entertainment", type: "expense" as const, color: "#ec4899", icon: "film", parentId: null, createdAt: nowISO() };
    const catTransfer = { id: generateId(), name: "Transfer", type: "transfer" as const, color: "#64748b", icon: "arrow-left-right", parentId: null, createdAt: nowISO() };

    await tx.insert(categories).values([
      catIncome, catFreelance, catGroceries, catDining, catRent,
      catTransport, catUtilities, catEntertainment, catTransfer,
    ]).run();

    const daysAgo = (n: number) => {
      const d = new Date();
      d.setDate(d.getDate() - n);
      return d.toISOString().slice(0, 10);
    };

    const tx1 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(5000), description: "Monthly salary", categoryId: catIncome.id, date: daysAgo(5), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx2 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(-150), description: "Groceries at Whole Foods", categoryId: catGroceries.id, date: daysAgo(3), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx3 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(-45), description: "Dinner at Italian place", categoryId: catDining.id, date: daysAgo(2), isReconciled: false, createdAt: nowISO(), updatedAt: nowISO() };
    const tx4 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(-1200), description: "Rent payment", categoryId: catRent.id, date: daysAgo(1), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx5 = { id: generateId(), accountId: accCredit.id, amount: centsFromDecimal(-60), description: "Gas station", categoryId: catTransport.id, date: daysAgo(4), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx6 = { id: generateId(), accountId: accCredit.id, amount: centsFromDecimal(-200), description: "Electric bill", categoryId: catUtilities.id, date: daysAgo(6), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx7 = { id: generateId(), accountId: accSavings.id, amount: centsFromDecimal(1000), description: "Monthly savings transfer", categoryId: catTransfer.id, date: daysAgo(5), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx8 = { id: generateId(), accountId: accCredit.id, amount: centsFromDecimal(-500), description: "Payment from checking", categoryId: catTransfer.id, date: daysAgo(2), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx9 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(-80), description: "Netflix subscription", categoryId: catEntertainment.id, date: daysAgo(7), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };
    const tx10 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(-500), description: "Credit card payment", categoryId: catTransfer.id, date: daysAgo(1), isReconciled: false, createdAt: nowISO(), updatedAt: nowISO() };
    const tx11 = { id: generateId(), accountId: accChecking.id, amount: centsFromDecimal(-2000), description: "Transfer to brokerage", categoryId: catTransfer.id, date: daysAgo(30), isReconciled: true, createdAt: nowISO(), updatedAt: nowISO() };

    await tx.insert(transactions).values([tx1, tx2, tx3, tx4, tx5, tx6, tx7, tx8, tx9, tx10, tx11]).run();

    const holdingVOO = {
      id: generateId(), accountId: accInvestment.id, symbol: "VOO",
      name: "Vanguard S&P 500 ETF", shares: 10, avgCostPerShare: centsFromDecimal(450),
      currentPrice: centsFromDecimal(480), createdAt: nowISO(), updatedAt: nowISO(),
    };
    const holdingAAPL = {
      id: generateId(), accountId: accInvestment.id, symbol: "AAPL",
      name: "Apple Inc.", shares: 5, avgCostPerShare: centsFromDecimal(175),
      currentPrice: centsFromDecimal(190), createdAt: nowISO(), updatedAt: nowISO(),
    };
    const holdingBND = {
      id: generateId(), accountId: accInvestment.id, symbol: "BND",
      name: "Vanguard Total Bond Market", shares: 20, avgCostPerShare: centsFromDecimal(72),
      currentPrice: centsFromDecimal(70), createdAt: nowISO(), updatedAt: nowISO(),
    };

    await tx.insert(holdings).values([holdingVOO, holdingAAPL, holdingBND]).run();

    const ht1 = { id: generateId(), holdingId: holdingVOO.id, type: "buy" as const, shares: 10, pricePerShare: centsFromDecimal(450), date: daysAgo(30), notes: "Initial purchase", createdAt: nowISO() };
    const ht2 = { id: generateId(), holdingId: holdingAAPL.id, type: "buy" as const, shares: 3, pricePerShare: centsFromDecimal(170), date: daysAgo(60), notes: null, createdAt: nowISO() };
    const ht3 = { id: generateId(), holdingId: holdingAAPL.id, type: "buy" as const, shares: 2, pricePerShare: centsFromDecimal(182), date: daysAgo(20), notes: "Added position", createdAt: nowISO() };
    const ht4 = { id: generateId(), holdingId: holdingBND.id, type: "buy" as const, shares: 20, pricePerShare: centsFromDecimal(72), date: daysAgo(45), notes: null, createdAt: nowISO() };

    await tx.insert(holdingTransactions).values([ht1, ht2, ht3, ht4]).run();

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgetGlobal = { id: generateId(), categoryId: null, month: currentMonth, year: currentYear, amountCents: centsFromDecimal(3000), rolloverCents: 0, createdAt: nowISO(), updatedAt: nowISO() };
    const budgetGroceries = { id: generateId(), categoryId: catGroceries.id, month: currentMonth, year: currentYear, amountCents: centsFromDecimal(500), rolloverCents: 85, createdAt: nowISO(), updatedAt: nowISO() };
    const budgetDining = { id: generateId(), categoryId: catDining.id, month: currentMonth, year: currentYear, amountCents: centsFromDecimal(200), rolloverCents: 0, createdAt: nowISO(), updatedAt: nowISO() };
    const budgetRent = { id: generateId(), categoryId: catRent.id, month: currentMonth, year: currentYear, amountCents: centsFromDecimal(1200), rolloverCents: 0, createdAt: nowISO(), updatedAt: nowISO() };
    const budgetTransport = { id: generateId(), categoryId: catTransport.id, month: currentMonth, year: currentYear, amountCents: centsFromDecimal(100), rolloverCents: 22, createdAt: nowISO(), updatedAt: nowISO() };
    const budgetEntertainment = { id: generateId(), categoryId: catEntertainment.id, month: currentMonth, year: currentYear, amountCents: centsFromDecimal(80), rolloverCents: 0, createdAt: nowISO(), updatedAt: nowISO() };

    await tx.insert(budgets).values([
      budgetGlobal, budgetGroceries, budgetDining, budgetRent, budgetTransport, budgetEntertainment,
    ]).run();
  });
}
