let initialized = false;

export async function ensureDbInitialized() {
  if (initialized) return;
  initialized = true;

  const { migrate } = await import("@/server/db/migrate");
  const { seed } = await import("@/server/db/seed");
  await migrate();
  await seed();
}
