export type CategoryType = "income" | "expense" | "transfer";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string | null;
  parentId: string | null;
  createdAt: string;
}
