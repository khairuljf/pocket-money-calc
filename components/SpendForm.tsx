import { Minus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { sanitizeAmountInput } from "../lib/currency";

type Props = {
  disabled: boolean;
  onSpend: (amount: number, reason: string) => Promise<boolean>;
};

export function SpendForm({ disabled, onSpend }: Props) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting || disabled) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    setSubmitting(true);
    const ok = await onSpend(n, reason);
    setSubmitting(false);
    if (ok) {
      setAmount("");
      setReason("");
    }
  };

  const submitDisabled = disabled || submitting || !amount.trim();

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="mb-2 text-sm font-semibold text-slate-700">Spend</Text>
      <View className="flex-row gap-2">
        <TextInput
          value={amount}
          onChangeText={(t) => setAmount(sanitizeAmountInput(t))}
          keyboardType="decimal-pad"
          editable={!disabled}
          placeholder="Amount"
          placeholderTextColor="#94a3b8"
          className={`flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 ${
            disabled ? "opacity-50" : ""
          }`}
        />
        <TextInput
          value={reason}
          onChangeText={setReason}
          editable={!disabled}
          placeholder="Item / reason"
          placeholderTextColor="#94a3b8"
          className={`rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 ${
            disabled ? "opacity-50" : ""
          }`}
          style={{ flex: 3 }}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>
      <Pressable
        onPress={handleSubmit}
        disabled={submitDisabled}
        className={`mt-3 flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-3 ${
          submitDisabled ? "opacity-50" : "active:bg-blue-700"
        }`}
      >
        <Minus color="white" size={18} />
        <Text className="ml-2 text-base font-semibold text-white">
          Add Expense
        </Text>
      </Pressable>
    </View>
  );
}
