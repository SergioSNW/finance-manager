export async function migrate() {
  const { getDb } = await import("@/lib/db");
  const db = await getDb();

  const statements = [
    `CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('checking', 'savings', 'credit', 'investment', 'cash')),
      currency TEXT NOT NULL DEFAULT 'USD',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'transfer')),
      color TEXT NOT NULL DEFAULT '#6366f1',
      icon TEXT,
      parent_id TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id),
      amount INTEGER NOT NULL,
      description TEXT NOT NULL,
      category_id TEXT REFERENCES categories(id),
      date TEXT NOT NULL,
      is_reconciled INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS holdings (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES accounts(id),
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      shares REAL NOT NULL DEFAULT 0,
      avg_cost_per_share INTEGER NOT NULL DEFAULT 0,
      current_price INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS holding_transactions (
      id TEXT PRIMARY KEY,
      holding_id TEXT NOT NULL REFERENCES holdings(id),
      type TEXT NOT NULL CHECK(type IN ('buy', 'sell')),
      shares REAL NOT NULL,
      price_per_share INTEGER NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category_id TEXT REFERENCES categories(id),
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      amount_cents INTEGER NOT NULL,
      rollover_cents INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(category_id, month, year)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id)`,
    `CREATE INDEX IF NOT EXISTS idx_holdings_account_id ON holdings(account_id)`,
    `CREATE INDEX IF NOT EXISTS idx_holding_transactions_holding_id ON holding_transactions(holding_id)`,
    `CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id)`,
  ];

  for (const sql of statements) {
    await db.run(sql);
  }
}
