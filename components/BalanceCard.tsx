import { Plus, Wallet } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  balance: number;
  onAddPress: () => void;
};

export function BalanceCard({ balance, onAddPress }: Props) {
  return (
    <View className="flex-row items-center rounded-2xl bg-emerald-600 px-5 py-5 shadow">
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-white/20">
        <Wallet color="white" size={24} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium uppercase tracking-wider text-emerald-50">
          Current Balance
        </Text>
        <Text className="mt-1 text-3xl font-bold text-white">
          {balance.toLocaleString()}
          <Text className="text-lg font-medium text-emerald-100">/-</Text>
        </Text>
      </View>
      <Pressable
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel="Add money"
        hitSlop={8}
        className="ml-3 h-12 w-12 items-center justify-center rounded-full bg-white active:bg-emerald-50"
      >
        <Plus color="#059669" size={26} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
