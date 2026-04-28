import { Receipt } from "lucide-react-native";
import { Text, View } from "react-native";

export function EmptyState() {
  return (
    <View className="items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10">
      <Receipt color="#94a3b8" size={36} />
      <Text className="mt-3 text-base font-semibold text-slate-700">
        No transactions yet
      </Text>
      <Text className="mt-1 text-center text-sm text-slate-500">
        Add money to your wallet, then track what you spend.
      </Text>
    </View>
  );
}
