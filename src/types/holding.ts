export interface Holding {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  shares: number;
  avgCostPerShare: number;
  currentPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingWithValue extends Holding {
  totalCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface HoldingTransaction {
  id: string;
  holdingId: string;
  type: "buy" | "sell";
  shares: number;
  pricePerShare: number;
  date: string;
  notes: string | null;
  createdAt: string;
}
