import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  clearAll,
  loadBalance,
  loadRevertOnDelete,
  loadTransactions,
  saveBalance,
  saveRevertOnDelete,
  saveTransactions,
} from "../lib/storage";
import type { SortOrder, Transaction } from "../types";

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function useWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [revertOnDelete, setRevertOnDeleteState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const [b, txs, revert] = await Promise.all([
        loadBalance(),
        loadTransactions(),
        loadRevertOnDelete(),
      ]);
      setBalance(b);
      setTransactions(txs);
      setRevertOnDeleteState(revert);
      setHydrated(true);
    })();
  }, []);

  const addMoney = useCallback(
    async (amountInput: number) => {
      const amount = Math.abs(Number(amountInput));
      if (!Number.isFinite(amount) || amount <= 0) {
        Alert.alert("Invalid amount", "Please enter a positive number.");
        return false;
      }
      const next = balance + amount;
      setBalance(next);
      await saveBalance(next);
      return true;
    },
    [balance],
  );

  const spend = useCallback(
    async (amountInput: number, reason: string) => {
      const amount = Math.abs(Number(amountInput));
      if (!Number.isFinite(amount) || amount <= 0) {
        Alert.alert("Invalid amount", "Please enter a positive number.");
        return false;
      }
      if (amount > balance) {
        Alert.alert(
          "Not enough balance",
          "Amount must be less than or equal to current balance.",
        );
        return false;
      }
      const tx: Transaction = {
        id: makeId(),
        amount,
        reason: reason.trim() || "Untitled",
        createdAt: new Date().toISOString(),
      };
      const nextTxs = [...transactions, tx];
      const nextBalance = balance - amount;
      setTransactions(nextTxs);
      setBalance(nextBalance);
      await Promise.all([saveTransactions(nextTxs), saveBalance(nextBalance)]);
      return true;
    },
    [balance, transactions],
  );

  const editTransaction = useCallback(
    async (id: string, amountInput: number, reason: string) => {
      const amount = Math.abs(Number(amountInput));
      if (!Number.isFinite(amount) || amount <= 0) {
        Alert.alert("Invalid amount", "Please enter a positive number.");
        return false;
      }
      const target = transactions.find((t) => t.id === id);
      if (!target) return false;
      const delta = amount - target.amount;
      const nextBalance = balance - delta;
      if (nextBalance < 0) {
        Alert.alert(
          "Not enough balance",
          "New amount is more than the available balance.",
        );
        return false;
      }
      const nextTxs = transactions.map((t) =>
        t.id === id
          ? { ...t, amount, reason: reason.trim() || "Untitled" }
          : t,
      );
      setTransactions(nextTxs);
      if (delta !== 0) setBalance(nextBalance);
      await Promise.all([
        saveTransactions(nextTxs),
        delta !== 0 ? saveBalance(nextBalance) : Promise.resolve(),
      ]);
      return true;
    },
    [balance, transactions],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const target = transactions.find((t) => t.id === id);
      if (!target) return;
      const nextTxs = transactions.filter((t) => t.id !== id);
      const nextBalance = revertOnDelete ? balance + target.amount : balance;
      setTransactions(nextTxs);
      if (revertOnDelete) setBalance(nextBalance);
      await Promise.all([
        saveTransactions(nextTxs),
        revertOnDelete ? saveBalance(nextBalance) : Promise.resolve(),
      ]);
    },
    [balance, transactions, revertOnDelete],
  );

  const resetAll = useCallback(() => {
    Alert.alert(
      "Reset everything?",
      "This will erase your balance and all transactions.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setBalance(0);
            setTransactions([]);
            await clearAll();
          },
        },
      ],
    );
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
  }, []);

  const setRevertOnDelete = useCallback(async (value: boolean) => {
    setRevertOnDeleteState(value);
    await saveRevertOnDelete(value);
  }, []);

  return {
    hydrated,
    balance,
    transactions,
    sortOrder,
    revertOnDelete,
    addMoney,
    spend,
    editTransaction,
    deleteTransaction,
    resetAll,
    toggleSortOrder,
    setRevertOnDelete,
  };
}
