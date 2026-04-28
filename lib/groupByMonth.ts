import dayjs from "dayjs";
import type { MonthSection, SortOrder, Transaction } from "../types";

export function groupByMonth(
  transactions: Transaction[],
  order: SortOrder = "desc",
): MonthSection[] {
  const buckets = new Map<string, { sortKey: number; data: Transaction[] }>();

  for (const tx of transactions) {
    const d = dayjs(tx.createdAt);
    const title = d.format("MMMM YYYY");
    const sortKey = d.startOf("month").valueOf();
    let bucket = buckets.get(title);
    if (!bucket) {
      bucket = { sortKey, data: [] };
      buckets.set(title, bucket);
    }
    bucket.data.push(tx);
  }

  const sections: MonthSection[] = Array.from(buckets.entries()).map(
    ([title, { sortKey, data }]) => {
      const sortedData = [...data].sort((a, b) => {
        const av = dayjs(a.createdAt).valueOf();
        const bv = dayjs(b.createdAt).valueOf();
        return order === "asc" ? av - bv : bv - av;
      });
      const total = sortedData.reduce((sum, t) => sum + t.amount, 0);
      return { title, total, data: sortedData, _sortKey: sortKey } as MonthSection & {
        _sortKey: number;
      };
    },
  );

  sections.sort((a, b) => {
    const av = (a as MonthSection & { _sortKey: number })._sortKey;
    const bv = (b as MonthSection & { _sortKey: number })._sortKey;
    return order === "asc" ? av - bv : bv - av;
  });

  return sections.map(({ title, total, data }) => ({ title, total, data }));
}
