import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Transaction } from "../types";

const BALANCE_KEY = "pmc:balance";
const TRANSACTIONS_KEY = "pmc:transactions";

export async function loadBalance(): Promise<number> {
  const raw = await AsyncStorage.getItem(BALANCE_KEY);
  if (raw == null) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function saveBalance(balance: number): Promise<void> {
  await AsyncStorage.setItem(BALANCE_KEY, String(balance));
}

export async function loadTransactions(): Promise<Transaction[]> {
  const raw = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  if (raw == null) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveTransactions(txs: Transaction[]): Promise<void> {
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txs));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([BALANCE_KEY, TRANSACTIONS_KEY]);
}
