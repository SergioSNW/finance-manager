export type AccountType = "checking" | "savings" | "credit" | "investment" | "cash";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountWithBalance extends Account {
  balance: number;
}
