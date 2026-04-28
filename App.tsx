import "./global.css";

import { StatusBar } from "expo-status-bar";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AddMoneyModal } from "./components/AddMoneyModal";
import { BalanceCard } from "./components/BalanceCard";
import { SpendForm } from "./components/SpendForm";
import { TransactionList } from "./components/TransactionList";
import { useWallet } from "./hooks/useWallet";

export default function App() {
  const {
    hydrated,
    balance,
    transactions,
    sortOrder,
    addMoney,
    spend,
    deleteTransaction,
    resetAll,
    toggleSortOrder,
  } = useWallet();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const hasData = balance > 0 || transactions.length > 0;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="flex-1 px-4 pb-4 pt-2">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-slate-900">
                Pocket Money
              </Text>
              <Pressable
                onPress={resetAll}
                disabled={!hasData}
                accessibilityRole="button"
                accessibilityLabel="Reset all data"
                hitSlop={8}
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  hasData
                    ? "bg-rose-50 active:bg-rose-100"
                    : "bg-slate-100 opacity-50"
                }`}
              >
                <Trash2 color={hasData ? "#e11d48" : "#94a3b8"} size={18} />
              </Pressable>
            </View>

            <TransactionList
              transactions={transactions}
              sortOrder={sortOrder}
              onToggleSort={toggleSortOrder}
              onDelete={deleteTransaction}
              ListHeaderComponent={
                <View className="gap-3">
                  <BalanceCard
                    balance={balance}
                    onAddPress={() => setAddModalOpen(true)}
                  />
                  <SpendForm
                    disabled={!hydrated || balance <= 0}
                    onSpend={spend}
                  />
                </View>
              }
            />
          </View>
        </KeyboardAvoidingView>
        <AddMoneyModal
          visible={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={addMoney}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
