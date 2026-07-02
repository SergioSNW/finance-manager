export const dynamic = "force-dynamic";

import { getAccounts } from "@/server/queries/accounts";
import { AccountCard } from "@/components/account-card";
import { EmptyState } from "@/components/empty-state";
import { CreateAccountForm } from "./create-form";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Accounts
        </h1>
        <CreateAccountForm />
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          description="Create your first account to start tracking your finances."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {accounts.map((a) => (
            <AccountCard key={a.id} {...a} />
          ))}
        </div>
      )}
    </div>
  );
}
