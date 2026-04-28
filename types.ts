export type Transaction = {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
};

export type SortOrder = "asc" | "desc";

export type MonthSection = {
  title: string;
  total: number;
  data: Transaction[];
};
