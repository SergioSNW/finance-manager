export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  categoryId: string | null;
  date: string;
  isReconciled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionWithAccount extends Transaction {
  accountName: string;
  accountType: string;
  categoryName: string | null;
  categoryColor: string | null;
}
