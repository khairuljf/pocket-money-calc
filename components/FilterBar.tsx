import dayjs from "dayjs";
import { Calendar, CalendarDays, ChevronDown, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
  monthFilter: string | null;
  dayFilter: string | null;
  onMonthChange: (m: string | null) => void;
  onDayChange: (d: string | null) => void;
};

type PickerKind = "month" | "day";

export function FilterBar({
  transactions,
  monthFilter,
  dayFilter,
  onMonthChange,
  onDayChange,
}: Props) {
  const [picker, setPicker] = useState<PickerKind | null>(null);

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    for (const tx of transactions) {
      set.add(dayjs(tx.createdAt).format("YYYY-MM"));
    }
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [transactions]);

  const dayOptions = useMemo(() => {
    const set = new Set<string>();
    for (const tx of transactions) {
      const d = dayjs(tx.createdAt);
      if (monthFilter && d.format("YYYY-MM") !== monthFilter) continue;
      set.add(d.format("YYYY-MM-DD"));
    }
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [transactions, monthFilter]);

  const monthLabel = monthFilter
    ? dayjs(`${monthFilter}-01`).format("MMM YYYY")
    : "All months";
  const dayLabel = dayFilter
    ? dayjs(dayFilter).format("DD MMM YYYY")
    : "All days";

  const closePicker = () => setPicker(null);

  const handlePickMonth = (value: string | null) => {
    onMonthChange(value);
    if (value && dayFilter && !dayFilter.startsWith(value)) {
      onDayChange(null);
    }
    if (!value) onDayChange(null);
    closePicker();
  };

  const handlePickDay = (value: string | null) => {
    if (value) {
      const m = value.slice(0, 7);
      if (monthFilter && monthFilter !== m) onMonthChange(m);
    }
    onDayChange(value);
    closePicker();
  };

  const options =
    picker === "month"
      ? monthOptions.map((v) => ({
          value: v,
          label: dayjs(`${v}-01`).format("MMMM YYYY"),
        }))
      : picker === "day"
        ? dayOptions.map((v) => ({
            value: v,
            label: dayjs(v).format("DD MMM YYYY"),
          }))
        : [];

  const selected = picker === "month" ? monthFilter : dayFilter;
  const onPick = picker === "month" ? handlePickMonth : handlePickDay;
  const allLabel = picker === "month" ? "All months" : "All days";

  return (
    <>
      <FilterChip
        icon={<Calendar color="#475569" size={14} />}
        label={monthLabel}
        active={!!monthFilter}
        onPress={() => setPicker("month")}
        onClear={
          monthFilter
            ? () => {
                onMonthChange(null);
                onDayChange(null);
              }
            : undefined
        }
      />
      <FilterChip
        icon={<CalendarDays color="#475569" size={14} />}
        label={dayLabel}
        active={!!dayFilter}
        onPress={() => setPicker("day")}
        onClear={dayFilter ? () => onDayChange(null) : undefined}
      />

      <Modal
        visible={picker !== null}
        transparent
        animationType="slide"
        onRequestClose={closePicker}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityLabel="Close"
            onPress={closePicker}
            className="absolute inset-0 bg-black/50"
          />
          <View className="max-h-[70%] rounded-t-3xl bg-white px-5 pb-8 pt-3">
            <View className="mb-3 items-center">
              <View className="h-1.5 w-12 rounded-full bg-slate-300" />
            </View>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-slate-900">
                {picker === "month" ? "Filter by month" : "Filter by day"}
              </Text>
              <Pressable
                onPress={closePicker}
                hitSlop={8}
                accessibilityLabel="Close"
                className="h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X color="#475569" size={20} />
              </Pressable>
            </View>
            <ScrollView
              className="max-h-96"
              keyboardShouldPersistTaps="handled"
            >
              <OptionRow
                label={allLabel}
                selected={selected === null}
                onPress={() => onPick(null)}
              />
              {options.length === 0 ? (
                <Text className="px-2 py-3 text-sm text-slate-500">
                  {picker === "day" && monthFilter
                    ? "No days in the selected month."
                    : "No transactions yet."}
                </Text>
              ) : (
                options.map((opt) => (
                  <OptionRow
                    key={opt.value}
                    label={opt.label}
                    selected={selected === opt.value}
                    onPress={() => onPick(opt.value)}
                  />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

type ChipProps = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
  onClear?: () => void;
};

function FilterChip({ icon, label, active, onPress, onClear }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className={`flex-row items-center rounded-lg border px-3 py-1.5 ${
        active
          ? "border-indigo-200 bg-indigo-50 active:bg-indigo-100"
          : "border-slate-200 bg-white active:bg-slate-100"
      }`}
    >
      {icon}
      <Text
        className={`ml-1.5 text-xs font-medium ${
          active ? "text-indigo-700" : "text-slate-700"
        }`}
        numberOfLines={1}
      >
        {label}
      </Text>
      {onClear ? (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          accessibilityLabel="Clear filter"
          className="ml-1.5"
        >
          <X color="#4f46e5" size={14} />
        </Pressable>
      ) : (
        <ChevronDown color="#475569" size={14} style={{ marginLeft: 6 }} />
      )}
    </Pressable>
  );
}

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionRow({ label, selected, onPress }: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-xl px-3 py-3 active:bg-slate-100 ${
        selected ? "bg-indigo-50" : ""
      }`}
    >
      <Text
        className={`text-base ${
          selected ? "font-semibold text-indigo-700" : "text-slate-800"
        }`}
      >
        {label}
      </Text>
      {selected ? (
        <View className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
      ) : null}
    </Pressable>
  );
}
