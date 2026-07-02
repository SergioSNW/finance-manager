import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/server/db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const tursoUrl = process.env.TURSO_DB_URL;
  const tursoToken = process.env.TURSO_DB_TOKEN;

  const url = tursoUrl || `file:${process.cwd()}/data/finledger.db`;

  const client = createClient({ url, authToken: tursoToken });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}
