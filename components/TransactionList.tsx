import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react-native";
import { useMemo } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { groupByMonth } from "../lib/groupByMonth";
import type { SortOrder, Transaction } from "../types";
import { EmptyState } from "./EmptyState";
import { TransactionRow } from "./TransactionRow";

type Props = {
  transactions: Transaction[];
  sortOrder: SortOrder;
  onToggleSort: () => void;
  onDelete: (id: string) => void;
};

export function TransactionList({
  transactions,
  sortOrder,
  onToggleSort,
  onDelete,
}: Props) {
  const sections = useMemo(
    () => groupByMonth(transactions, sortOrder),
    [transactions, sortOrder],
  );

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <View className="flex-1">
      <View className="mb-2 flex-row items-center justify-between px-1">
        <Text className="text-base font-semibold text-slate-700">History</Text>
        <Pressable
          onPress={onToggleSort}
          className="flex-row items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 active:bg-slate-100"
          hitSlop={6}
        >
          {sortOrder === "desc" ? (
            <ArrowDownNarrowWide color="#475569" size={16} />
          ) : (
            <ArrowUpNarrowWide color="#475569" size={16} />
          )}
          <Text className="ml-1.5 text-xs font-medium text-slate-700">
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </Text>
        </Pressable>
      </View>
      <View className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <View className="flex-row items-center justify-between bg-slate-100 px-4 py-2">
              <Text className="text-sm font-bold text-slate-800">
                {section.title}
              </Text>
              <Text className="text-xs font-semibold text-rose-600">
                -{section.total.toLocaleString()}/-
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TransactionRow tx={item} onDelete={onDelete} />
          )}
        />
      </View>
    </View>
  );
}
