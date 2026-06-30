export interface Budget {
  id: string;
  categoryId: string | null;
  month: number;
  year: number;
  amountCents: number;
  rolloverCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithProgress extends Budget {
  categoryName: string | null;
  categoryColor: string | null;
  actualSpent: number;
  available: number;
  remaining: number;
  percentage: number;
  status: "on_track" | "near_limit" | "exceeded";
}

export interface BudgetFormData {
  categoryId: string;
  month: number;
  year: number;
  amountCents: number;
}
