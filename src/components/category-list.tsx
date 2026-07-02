"use client";

import { useActionState, useState } from "react";
import { createCategory } from "@/server/actions/categories";
import type { Category } from "@/types";

export function CategoryList({
  categories,
}: {
  categories: Category[];
}) {
  const [showNew, setShowNew] = useState(false);
  const wrappedCreate = async (_prev: unknown, fd: FormData) => createCategory(fd);
  const [createState, createAction, creating] = useActionState(
    wrappedCreate,
    null
  );

  const expenseCats = categories.filter((c) => c.type === "expense");
  const incomeCats = categories.filter((c) => c.type === "income");
  const transferCats = categories.filter((c) => c.type === "transfer");

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowNew(!showNew)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        + Add Category
      </button>

      {showNew && (
        <form
          action={createAction}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <div className="mb-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">
                Name
              </label>
              <input
                name="name"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">
                Type
              </label>
              <select
                name="type"
                required
                className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">
                Color
              </label>
              <input
                name="color"
                type="color"
                defaultValue="#6366f1"
                className="h-9 w-full rounded-lg border border-zinc-300 dark:border-zinc-600"
              />
            </div>
          </div>
          {createState?.error && (
            <p className="mb-2 text-sm text-red-500">{createState.error}</p>
          )}
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      <CategoryGroup title="Expenses" categories={expenseCats} />
      <CategoryGroup title="Income" categories={incomeCats} />
      <CategoryGroup title="Transfers" categories={transferCats} />
    </div>
  );
}

function CategoryGroup({
  title,
  categories,
}: {
  title: string;
  categories: Category[];
}) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <CategoryBadge key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
      style={{
        backgroundColor: category.color + "20",
        color: category.color,
      }}
    >
      {category.icon && <span>{category.icon}</span>}
      {category.name}
    </span>
  );
}
