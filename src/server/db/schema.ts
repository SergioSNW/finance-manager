import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", {
    enum: ["checking", "savings", "credit", "investment", "cash"],
  }).notNull(),
  currency: text("currency").notNull().default("USD"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["income", "expense", "transfer"] }).notNull(),
  color: text("color").notNull().default("#6366f1"),
  icon: text("icon"),
  parentId: text("parent_id"),
  createdAt: text("created_at").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  categoryId: text("category_id").references(() => categories.id),
  date: text("date").notNull(),
  isReconciled: integer("is_reconciled", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const holdings = sqliteTable("holdings", {
  id: text("id").primaryKey(),
  accountId: text("account_id")
    .notNull()
    .references(() => accounts.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  shares: real("shares").notNull().default(0),
  avgCostPerShare: integer("avg_cost_per_share").notNull().default(0),
  currentPrice: integer("current_price"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const holdingTransactions = sqliteTable("holding_transactions", {
  id: text("id").primaryKey(),
  holdingId: text("holding_id")
    .notNull()
    .references(() => holdings.id),
  type: text("type", { enum: ["buy", "sell"] }).notNull(),
  shares: real("shares").notNull(),
  pricePerShare: integer("price_per_share").notNull(),
  date: text("date").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});
