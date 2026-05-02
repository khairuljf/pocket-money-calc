import { Check, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { sanitizeAmountInput } from "../lib/currency";
import type { Transaction } from "../types";

type Props = {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (id: string, amount: number, reason: string) => Promise<boolean>;
};

export function EditTransactionModal({ transaction, onClose, onSave }: Props) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setReason(transaction.reason);
    }
  }, [transaction]);

  const handleSave = async () => {
    if (!transaction || submitting) return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    setSubmitting(true);
    const ok = await onSave(transaction.id, n, reason);
    setSubmitting(false);
    if (ok) onClose();
  };

  const disabled = submitting || !amount.trim();

  return (
    <Modal
      visible={transaction !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          className="absolute inset-0 bg-black/50"
        />
        <KeyboardAvoidingView behavior="padding">
          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-3">
            <View className="mb-3 items-center">
              <View className="h-1.5 w-12 rounded-full bg-slate-300" />
            </View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                Edit Transaction
              </Text>
              <Pressable
                onPress={onClose}
                hitSlop={8}
                accessibilityLabel="Close"
                className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X color="#475569" size={20} />
              </Pressable>
            </View>

            <Text className="mb-1 text-xs font-semibold text-slate-600">
              Amount
            </Text>
            <TextInput
              value={amount}
              onChangeText={(t) => setAmount(sanitizeAmountInput(t))}
              keyboardType="decimal-pad"
              placeholder="Enter amount"
              placeholderTextColor="#94a3b8"
              className="mb-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900"
              returnKeyType="next"
            />

            <Text className="mb-1 text-xs font-semibold text-slate-600">
              Item / reason
            </Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Item / reason"
              placeholderTextColor="#94a3b8"
              className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <Pressable
              onPress={handleSave}
              disabled={disabled}
              className={`mt-4 flex-row items-center justify-center rounded-lg bg-blue-600 px-4 py-3 ${
                disabled ? "opacity-50" : "active:bg-blue-700"
              }`}
            >
              <Check color="white" size={18} />
              <Text className="ml-2 text-base font-semibold text-white">
                Save Changes
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
