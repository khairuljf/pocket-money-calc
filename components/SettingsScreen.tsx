import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COMMON_CURRENCIES,
  DEVICE_CURRENCY_CODE,
  useCurrency,
} from "../lib/currency";

type Props = {
  onBack: () => void;
  onResetAll: () => void;
  onOpenAddMoney: () => void;
  hasData: boolean;
  revertOnDelete: boolean;
  onChangeRevertOnDelete: (value: boolean) => void;
};

export function SettingsScreen({
  onBack,
  onResetAll,
  onOpenAddMoney,
  hasData,
  revertOnDelete,
  onChangeRevertOnDelete,
}: Props) {
  const { code, isOverride, setOverride, resetToDevice } = useCurrency();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
      <View className="flex-row items-center border-b border-slate-200 bg-white px-3 py-3">
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          className="flex-row items-center rounded-full px-2 py-1 active:bg-slate-100"
        >
          <ChevronLeft color="#475569" size={22} />
          <Text className="ml-1 text-sm font-medium text-slate-700">Back</Text>
        </Pressable>
        <Text className="ml-2 text-lg font-bold text-slate-900">Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Wallet
        </Text>
        <View className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Pressable
            onPress={onOpenAddMoney}
            className="flex-row items-center px-4 py-3 active:bg-slate-50"
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <PlusCircle color="#059669" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-slate-900">
                Add Money
              </Text>
              <Text className="mt-0.5 text-xs text-slate-500">
                Top up your wallet
              </Text>
            </View>
            <ChevronRight color="#94a3b8" size={18} />
          </Pressable>
        </View>

        <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Preferences
        </Text>
        <View className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Pressable
            onPress={() => setPickerOpen(true)}
            className="flex-row items-center px-4 py-3 active:bg-slate-50"
          >
            <View className="flex-1 pr-3">
              <Text className="text-base font-medium text-slate-900">
                Currency
              </Text>
              <Text className="mt-0.5 text-xs text-slate-500">
                {isOverride
                  ? `Custom · device default is ${DEVICE_CURRENCY_CODE}`
                  : "Follows your phone's region settings"}
              </Text>
            </View>
            <Text className="mr-2 text-base font-semibold text-slate-700">
              {code}
            </Text>
            <ChevronRight color="#94a3b8" size={18} />
          </Pressable>
        </View>

        <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Behavior
        </Text>
        <View className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <View className="flex-row items-center px-4 py-3">
            <View className="flex-1 pr-3">
              <Text className="text-base font-medium text-slate-900">
                Refund deleted expenses
              </Text>
              <Text className="mt-0.5 text-xs text-slate-500">
                {revertOnDelete
                  ? "Deleting an expense returns its amount to your balance."
                  : "Deleting an expense removes it without changing your balance."}
              </Text>
            </View>
            <Switch
              value={revertOnDelete}
              onValueChange={onChangeRevertOnDelete}
              trackColor={{ false: "#cbd5e1", true: "#10b981" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#cbd5e1"
            />
          </View>
        </View>

        <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Danger zone
        </Text>
        <View className="rounded-2xl border border-rose-200 bg-white p-4">
          <Text className="text-base font-semibold text-slate-900">
            Erase all data
          </Text>
          <Text className="mt-1 text-sm text-slate-600">
            Permanently removes your current balance and every transaction.
            This cannot be undone.
          </Text>
          <Pressable
            onPress={onResetAll}
            disabled={!hasData}
            accessibilityRole="button"
            accessibilityLabel="Erase all data"
            className={`mt-4 flex-row items-center justify-center rounded-xl px-4 py-3 ${
              hasData
                ? "bg-rose-600 active:bg-rose-700"
                : "bg-slate-200 opacity-60"
            }`}
          >
            <Trash2 color={hasData ? "white" : "#94a3b8"} size={18} />
            <Text
              className={`ml-2 text-sm font-semibold ${
                hasData ? "text-white" : "text-slate-500"
              }`}
            >
              {hasData ? "Erase all data" : "Nothing to erase"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          className="mt-8 flex-row items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 active:bg-slate-100"
        >
          <ArrowLeft color="#475569" size={18} />
          <Text className="ml-2 text-sm font-semibold text-slate-700">
            Back to Home
          </Text>
        </Pressable>
      </ScrollView>

      <CurrencyPickerModal
        visible={pickerOpen}
        currentCode={code}
        isOverride={isOverride}
        onClose={() => setPickerOpen(false)}
        onPick={async (next) => {
          await setOverride(next);
          setPickerOpen(false);
        }}
        onResetToDevice={async () => {
          await resetToDevice();
          setPickerOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

type PickerProps = {
  visible: boolean;
  currentCode: string;
  isOverride: boolean;
  onClose: () => void;
  onPick: (code: string) => void;
  onResetToDevice: () => void;
};

function CurrencyPickerModal({
  visible,
  currentCode,
  isOverride,
  onClose,
  onPick,
  onResetToDevice,
}: PickerProps) {
  const options = useMemo(() => {
    const seen = new Set<string>();
    const list: { code: string; label: string }[] = [];
    for (const c of COMMON_CURRENCIES) {
      if (!seen.has(c.code)) {
        seen.add(c.code);
        list.push(c);
      }
    }
    if (!seen.has(DEVICE_CURRENCY_CODE)) {
      list.unshift({
        code: DEVICE_CURRENCY_CODE,
        label: `${DEVICE_CURRENCY_CODE} (device)`,
      });
    }
    if (!seen.has(currentCode)) {
      list.unshift({ code: currentCode, label: currentCode });
    }
    return list;
  }, [currentCode]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          className="absolute inset-0"
        />
        <View className="max-h-[80%] rounded-t-3xl bg-white px-5 pb-8 pt-3">
          <View className="mb-3 items-center">
            <View className="h-1.5 w-12 rounded-full bg-slate-300" />
          </View>
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-900">
              Choose currency
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

          {isOverride ? (
            <Pressable
              onPress={onResetToDevice}
              className="mb-3 flex-row items-center rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-3 active:bg-indigo-100"
            >
              <RotateCcw color="#4f46e5" size={18} />
              <Text className="ml-2 text-sm font-semibold text-indigo-700">
                Reset to device default ({DEVICE_CURRENCY_CODE})
              </Text>
            </Pressable>
          ) : null}

          <ScrollView
            className="max-h-[480px]"
            keyboardShouldPersistTaps="handled"
          >
            {options.map((opt) => {
              const selected = opt.code === currentCode;
              return (
                <Pressable
                  key={opt.code}
                  onPress={() => onPick(opt.code)}
                  className={`flex-row items-center justify-between rounded-xl px-3 py-3 active:bg-slate-100 ${
                    selected ? "bg-indigo-50" : ""
                  }`}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className={`text-base ${
                        selected
                          ? "font-semibold text-indigo-700"
                          : "text-slate-900"
                      }`}
                    >
                      {opt.code}
                      {opt.code === DEVICE_CURRENCY_CODE ? "  · device" : ""}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-500">
                      {opt.label}
                    </Text>
                  </View>
                  {selected ? (
                    <Check color="#4f46e5" size={18} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
