import dayjs from "dayjs";
import { Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useCurrency } from "../lib/currency";
import type { Transaction } from "../types";

type Props = {
  tx: Transaction;
  onDelete: (id: string) => void;
};

export function TransactionRow({ tx, onDelete }: Props) {
  const date = dayjs(tx.createdAt);
  const { formatNegative } = useCurrency();
  return (
    <View className="flex-row items-center border-b border-slate-100 bg-white px-4 py-3">
      <View className="flex-1">
        <Text className="text-base font-medium text-slate-900" numberOfLines={1}>
          {tx.reason}
        </Text>
        <Text className="mt-0.5 text-xs text-slate-500">
          {date.format("DD MMM YYYY")} · {date.format("hh:mm A")}
        </Text>
      </View>
      <Text className="mr-3 text-base font-semibold text-rose-600">
        {formatNegative(tx.amount)}
      </Text>
      <Pressable
        onPress={() => onDelete(tx.id)}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center rounded-full active:bg-rose-50"
      >
        <Trash2 color="#e11d48" size={18} />
      </Pressable>
    </View>
  );
}
