import { X } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { AddMoneyForm } from "./AddMoneyForm";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number) => Promise<boolean>;
};

export function AddMoneyModal({ visible, onClose, onAdd }: Props) {
  const handleAdd = async (amount: number) => {
    const ok = await onAdd(amount);
    if (ok) onClose();
    return ok;
  };

  return (
    <Modal
      visible={visible}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-3">
            <View className="mb-3 items-center">
              <View className="h-1.5 w-12 rounded-full bg-slate-300" />
            </View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                Add Money
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
            <AddMoneyForm onAdd={handleAdd} variant="bare" autoFocus />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
