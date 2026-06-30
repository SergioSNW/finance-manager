export const dynamic = "force-dynamic";

import { getAccounts } from "@/server/queries/accounts";
import { getCategories } from "@/server/queries/categories";
import { CsvImportWizard } from "./wizard";

export default function ImportPage() {
  const accounts = getAccounts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-2xl p-4 lg:p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Import Transactions from CSV
      </h1>
      <CsvImportWizard
        accounts={accounts}
        categories={categories.filter((c) => c.type === "expense")}
      />
    </div>
  );
}
