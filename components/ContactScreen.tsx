import { ChevronLeft, Mail } from "lucide-react-native";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onBack: () => void;
};

const CONTACT_EMAIL = "khairuljf@gmail.com";

export function ContactScreen({ onBack }: Props) {
  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Cannot open", url);
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Failed to open", msg);
    }
  };

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
        <Text className="ml-2 text-lg font-bold text-slate-900">
          Contact Us
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="mb-4 text-base leading-6 text-slate-700">
          We&apos;d love to hear from you. Reach out with feedback, bug
          reports, or feature ideas.
        </Text>

        <ContactRow
          icon={<Mail color="#4f46e5" size={18} />}
          label="Email"
          value={CONTACT_EMAIL}
          onPress={() => openUrl(`mailto:${CONTACT_EMAIL}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

type RowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
};

function ContactRow({ icon, label, value, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4 active:bg-slate-50"
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </Text>
        <Text className="mt-0.5 text-base font-medium text-slate-900">
          {value}
        </Text>
      </View>
    </Pressable>
  );
}
