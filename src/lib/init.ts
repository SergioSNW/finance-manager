let initialized = false;

export function ensureDbInitialized() {
  if (initialized) return;
  initialized = true;

  const { migrate } = require("@/server/db/migrate");
  const { seed } = require("@/server/db/seed");
  migrate();
  seed();
}
