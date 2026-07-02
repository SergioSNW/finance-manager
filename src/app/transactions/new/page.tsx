export const dynamic = "force-dynamic";

import { getAccounts } from "@/server/queries/accounts";
import { getCategories } from "@/server/queries/categories";
import { TransactionForm } from "@/components/transaction-form";

export default async function NewTransactionPage() {
  const accounts = await getAccounts();
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-lg p-4 lg:p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Add Transaction
      </h1>
      <TransactionForm accounts={accounts} categories={categories} />
    </div>
  );
}
