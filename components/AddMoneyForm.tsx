import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = {
  onAdd: (amount: number) => Promise<boolean>;
  variant?: "card" | "bare";
  autoFocus?: boolean;
};

export function AddMoneyForm({
  onAdd,
  variant = "card",
  autoFocus = false,
}: Props) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return;
    setSubmitting(true);
    const ok = await onAdd(n);
    setSubmitting(false);
    if (ok) setValue("");
  };

  const disabled = submitting || !value.trim();

  const content = (
    <>
      {variant === "card" && (
        <Text className="mb-2 text-sm font-semibold text-slate-700">
          Add Money
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        placeholder="Enter amount"
        placeholderTextColor="#94a3b8"
        className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900"
        returnKeyType="done"
        autoFocus={autoFocus}
        onSubmitEditing={handleSubmit}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={disabled}
        className={`mt-3 flex-row items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 ${
          disabled ? "opacity-50" : "active:bg-emerald-700"
        }`}
      >
        <Plus color="white" size={18} />
        <Text className="ml-2 text-base font-semibold text-white">
          Add Money
        </Text>
      </Pressable>
    </>
  );

  if (variant === "bare") {
    return <View>{content}</View>;
  }

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      {content}
    </View>
  );
}
