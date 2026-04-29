import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Transaction } from "../types";

const BALANCE_KEY = "pmc:balance";
const TRANSACTIONS_KEY = "pmc:transactions";
const CURRENCY_KEY = "pmc:currency";
const REVERT_ON_DELETE_KEY = "pmc:revertOnDelete";

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

export async function loadCurrencyOverride(): Promise<string | null> {
  const raw = await AsyncStorage.getItem(CURRENCY_KEY);
  return raw && raw.length > 0 ? raw : null;
}

export async function saveCurrencyOverride(code: string): Promise<void> {
  await AsyncStorage.setItem(CURRENCY_KEY, code);
}

export async function clearCurrencyOverride(): Promise<void> {
  await AsyncStorage.removeItem(CURRENCY_KEY);
}

export async function loadRevertOnDelete(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(REVERT_ON_DELETE_KEY);
  if (raw == null) return false;
  return raw === "true";
}

export async function saveRevertOnDelete(value: boolean): Promise<void> {
  await AsyncStorage.setItem(REVERT_ON_DELETE_KEY, value ? "true" : "false");
}
