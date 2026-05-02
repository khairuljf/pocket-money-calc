import dayjs from "dayjs";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  FileDown,
} from "lucide-react-native";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { useCurrency } from "../lib/currency";
import { exportTransactionsPdf } from "../lib/exportPdf";
import { groupByMonth } from "../lib/groupByMonth";
import type { SortOrder, Transaction } from "../types";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { TransactionRow } from "./TransactionRow";

type Props = {
  transactions: Transaction[];
  sortOrder: SortOrder;
  onToggleSort: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  ListHeaderComponent?: ReactElement | null;
};

export function TransactionList({
  transactions,
  sortOrder,
  onToggleSort,
  onEdit,
  onDelete,
  ListHeaderComponent,
}: Props) {
  const [monthFilter, setMonthFilter] = useState<string | null>(() =>
    dayjs().format("YYYY-MM"),
  );
  const [dayFilter, setDayFilter] = useState<string | null>(null);
  const { formatNegative } = useCurrency();

  const filtered = useMemo(() => {
    if (!monthFilter && !dayFilter) return transactions;
    return transactions.filter((tx) => {
      const d = dayjs(tx.createdAt);
      if (dayFilter && d.format("YYYY-MM-DD") !== dayFilter) return false;
      if (monthFilter && d.format("YYYY-MM") !== monthFilter) return false;
      return true;
    });
  }, [transactions, monthFilter, dayFilter]);

  const sections = useMemo(
    () => groupByMonth(filtered, sortOrder),
    [filtered, sortOrder],
  );

  const hasItems = transactions.length > 0;
  const isFiltered = monthFilter !== null || dayFilter !== null;

  const handleDownload = () => {
    exportTransactionsPdf({
      transactions: filtered,
      monthFilter,
      dayFilter,
      sortOrder,
      formatNegative,
    });
  };

  const header = (
    <View>
      {ListHeaderComponent}
      <View className="mb-2 mt-3 flex-row items-center justify-between px-1">
        <Text className="text-base font-semibold text-slate-700">History</Text>
        {hasItems ? (
          <Pressable
            onPress={handleDownload}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Download PDF"
            className="flex-row items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 active:bg-indigo-100"
          >
            <FileDown color="#4f46e5" size={16} />
            <Text className="ml-1.5 text-xs font-semibold text-indigo-700">
              Download PDF
            </Text>
          </Pressable>
        ) : null}
      </View>
      {hasItems ? (
        <View className="mb-2 flex-row items-center justify-between gap-2 px-1">
          <View className="flex-1 flex-row flex-wrap items-center gap-2">
            <FilterBar
              transactions={transactions}
              monthFilter={monthFilter}
              dayFilter={dayFilter}
              onMonthChange={setMonthFilter}
              onDayChange={setDayFilter}
            />
          </View>
          <Pressable
            onPress={onToggleSort}
            className="flex-row items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 active:bg-slate-100"
            hitSlop={6}
          >
            {sortOrder === "desc" ? (
              <ArrowDownNarrowWide color="#475569" size={14} />
            ) : (
              <ArrowUpNarrowWide color="#475569" size={14} />
            )}
            <Text className="ml-1.5 text-xs font-medium text-slate-700">
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      stickySectionHeadersEnabled
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View className="px-1">
          {isFiltered && hasItems ? (
            <View className="items-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8">
              <Text className="text-sm text-slate-500">
                No transactions match the selected filter.
              </Text>
              <Pressable
                onPress={() => {
                  setMonthFilter(null);
                  setDayFilter(null);
                }}
                className="mt-3 rounded-lg bg-indigo-50 px-3 py-1.5 active:bg-indigo-100"
                hitSlop={6}
              >
                <Text className="text-xs font-semibold text-indigo-700">
                  Clear filters
                </Text>
              </Pressable>
            </View>
          ) : (
            <EmptyState />
          )}
        </View>
      }
      renderSectionHeader={({ section }) => (
        <View className="flex-row items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-2">
          <Text className="text-sm font-bold text-slate-800">
            {section.title}
          </Text>
          <Text className="text-xs font-semibold text-rose-600">
            {formatNegative(section.total)}
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <TransactionRow tx={item} onEdit={onEdit} onDelete={onDelete} />
      )}
    />
  );
}
