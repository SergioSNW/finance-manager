export const dynamic = "force-dynamic";

import { getCategories } from "@/server/queries/categories";
import { CategoryList } from "@/components/category-list";
import { EmptyState } from "@/components/empty-state";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-4 lg:p-6">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Categories
      </h1>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create categories to organize your transactions."
        />
      ) : (
        <CategoryList categories={categories} />
      )}
    </div>
  );
}
