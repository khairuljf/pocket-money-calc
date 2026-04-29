import Constants from "expo-constants";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onBack: () => void;
};

export function AboutScreen({ onBack }: Props) {
  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <View className="flex-row items-center border-b border-slate-200 bg-white px-3 py-3">
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityLabel="Back"
          className="h-9 w-9 items-center justify-center rounded-full active:bg-slate-100"
        >
          <ChevronLeft color="#475569" size={22} />
        </Pressable>
        <Text className="ml-2 text-lg font-bold text-slate-900">About</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="mb-4 items-center">
          <Text className="text-2xl font-bold text-slate-900">
            Pocket Money Calculator
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            Version {version}
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-base leading-6 text-slate-700">
            A simple, offline-first pocket money tracker. Top up your wallet,
            log every expense with a reason, and review your spending history
            grouped by month.
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Features
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Add money and log expenses with a reason
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Balance updates automatically as you spend
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • History grouped by month with per-month totals
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Filter history by month or specific day
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Sort transactions newest or oldest first
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Export the filtered, sorted history as a PDF and share it
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Currency auto-detected from your phone, with a manual override
          </Text>
          <Text className="mb-1 text-sm leading-5 text-slate-700">
            • Optional refund-on-delete: choose whether removing an expense
            returns the amount to your balance
          </Text>
          <Text className="text-sm leading-5 text-slate-700">
            • Works fully offline; data stays on your device
          </Text>
        </View>

        <Text className="text-center text-xs text-slate-400">
          Made with care.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
