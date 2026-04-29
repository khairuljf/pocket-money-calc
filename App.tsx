import "./global.css";

import { StatusBar } from "expo-status-bar";
import {
  Menu,
  PlusCircle,
  Settings as SettingsIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AboutScreen } from "./components/AboutScreen";
import { AddMoneyModal } from "./components/AddMoneyModal";
import { BalanceCard } from "./components/BalanceCard";
import { ContactScreen } from "./components/ContactScreen";
import { MenuDrawer } from "./components/MenuDrawer";
import { SettingsScreen } from "./components/SettingsScreen";
import { SpendForm } from "./components/SpendForm";
import { TransactionList } from "./components/TransactionList";
import { useWallet } from "./hooks/useWallet";
import { CurrencyProvider } from "./lib/currency";

export default function App() {
  const {
    hydrated,
    balance,
    transactions,
    sortOrder,
    revertOnDelete,
    addMoney,
    spend,
    deleteTransaction,
    resetAll,
    toggleSortOrder,
    setRevertOnDelete,
  } = useWallet();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const hasData = balance > 0 || transactions.length > 0;

  return (
    <SafeAreaProvider>
      <CurrencyProvider>
      <View className="flex-1 bg-slate-50">
        <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
          <StatusBar style="dark" />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <View className="flex-1 px-4 pb-4 pt-2">
              <View className="mb-3 flex-row items-center justify-between">
                <Pressable
                  onPress={() => setMenuOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Open menu"
                  hitSlop={8}
                  className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
                >
                  <Menu color="#475569" size={20} />
                </Pressable>
                <Text
                  className="flex-1 text-center text-lg font-bold text-slate-900"
                  numberOfLines={1}
                >
                  Pocket Money Calculator
                </Text>
                <Pressable
                  onPress={() => setSettingsOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Open settings"
                  hitSlop={8}
                  className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
                >
                  <SettingsIcon color="#475569" size={20} />
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
                    {hydrated && balance <= 0 ? (
                      <Pressable
                        onPress={() => setAddModalOpen(true)}
                        accessibilityRole="button"
                        accessibilityLabel="Add money to your wallet"
                        className="flex-row items-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 active:bg-emerald-100"
                      >
                        <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-emerald-600">
                          <PlusCircle color="white" size={22} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-emerald-900">
                            Add money to get started
                          </Text>
                          <Text className="mt-0.5 text-xs text-emerald-700">
                            Top up your wallet to start tracking expenses.
                          </Text>
                        </View>
                      </Pressable>
                    ) : (
                      <SpendForm
                        disabled={!hydrated || balance <= 0}
                        onSpend={spend}
                      />
                    )}
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
          <Modal
            visible={settingsOpen}
            animationType="slide"
            onRequestClose={() => setSettingsOpen(false)}
            statusBarTranslucent
          >
            <SafeAreaProvider>
              <SettingsScreen
                onBack={() => setSettingsOpen(false)}
                onResetAll={() => {
                  resetAll();
                }}
                onOpenAddMoney={() => {
                  setSettingsOpen(false);
                  setAddModalOpen(true);
                }}
                hasData={hasData}
                revertOnDelete={revertOnDelete}
                onChangeRevertOnDelete={setRevertOnDelete}
              />
            </SafeAreaProvider>
          </Modal>
          <Modal
            visible={aboutOpen}
            animationType="slide"
            onRequestClose={() => setAboutOpen(false)}
            statusBarTranslucent
          >
            <SafeAreaProvider>
              <AboutScreen onBack={() => setAboutOpen(false)} />
            </SafeAreaProvider>
          </Modal>
          <Modal
            visible={contactOpen}
            animationType="slide"
            onRequestClose={() => setContactOpen(false)}
            statusBarTranslucent
          >
            <SafeAreaProvider>
              <ContactScreen onBack={() => setContactOpen(false)} />
            </SafeAreaProvider>
          </Modal>
        </SafeAreaView>
        <MenuDrawer
          visible={menuOpen}
          onClose={() => setMenuOpen(false)}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenContact={() => setContactOpen(true)}
        />
      </View>
      </CurrencyProvider>
    </SafeAreaProvider>
  );
}
