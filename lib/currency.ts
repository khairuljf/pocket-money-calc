import * as Localization from "expo-localization";
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearCurrencyOverride,
  loadCurrencyOverride,
  saveCurrencyOverride,
} from "./storage";

function pickDeviceCurrencyCode(): string {
  const locales = Localization.getLocales();
  for (const l of locales) {
    if (l.currencyCode) return l.currencyCode;
  }
  return "USD";
}

function pickLocaleTag(): string {
  const locales = Localization.getLocales();
  return locales[0]?.languageTag ?? "en-US";
}

const DEVICE_CURRENCY = pickDeviceCurrencyCode();
const LOCALE_TAG = pickLocaleTag();

export const DEVICE_CURRENCY_CODE = DEVICE_CURRENCY;

export function sanitizeAmountInput(text: string): string {
  const cleaned = text.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  return parts.length <= 1 ? cleaned : parts[0] + "." + parts.slice(1).join("");
}

function makeFormatters(code: string) {
  const full = new Intl.NumberFormat(LOCALE_TAG, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  });
  const compact = new Intl.NumberFormat(LOCALE_TAG, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  });
  return { full, compact };
}

type CurrencyContextValue = {
  code: string;
  isOverride: boolean;
  format: (amount: number) => string;
  formatNegative: (amount: number) => string;
  setOverride: (code: string) => Promise<void>;
  resetToDevice: () => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string>(DEVICE_CURRENCY);
  const [isOverride, setIsOverride] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const stored = await loadCurrencyOverride();
      if (stored && stored !== DEVICE_CURRENCY) {
        setCode(stored);
        setIsOverride(true);
      } else if (stored && stored === DEVICE_CURRENCY) {
        setIsOverride(false);
      }
    })();
  }, []);

  const formatters = useMemo(() => makeFormatters(code), [code]);

  const format = useCallback(
    (amount: number) =>
      Number.isInteger(amount)
        ? formatters.compact.format(amount)
        : formatters.full.format(amount),
    [formatters],
  );

  const formatNegative = useCallback(
    (amount: number) => `-${format(Math.abs(amount))}`,
    [format],
  );

  const setOverride = useCallback(async (next: string) => {
    await saveCurrencyOverride(next);
    setCode(next);
    setIsOverride(next !== DEVICE_CURRENCY);
  }, []);

  const resetToDevice = useCallback(async () => {
    await clearCurrencyOverride();
    setCode(DEVICE_CURRENCY);
    setIsOverride(false);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      code,
      isOverride,
      format,
      formatNegative,
      setOverride,
      resetToDevice,
    }),
    [code, isOverride, format, formatNegative, setOverride, resetToDevice],
  );

  return createElement(CurrencyContext.Provider, { value }, children);
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return ctx;
}

export const COMMON_CURRENCIES: ReadonlyArray<{
  code: string;
  label: string;
}> = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "INR", label: "Indian Rupee" },
  { code: "BDT", label: "Bangladeshi Taka" },
  { code: "PKR", label: "Pakistani Rupee" },
  { code: "CNY", label: "Chinese Yuan" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "SGD", label: "Singapore Dollar" },
  { code: "MYR", label: "Malaysian Ringgit" },
  { code: "THB", label: "Thai Baht" },
  { code: "IDR", label: "Indonesian Rupiah" },
  { code: "PHP", label: "Philippine Peso" },
  { code: "AED", label: "UAE Dirham" },
  { code: "SAR", label: "Saudi Riyal" },
  { code: "TRY", label: "Turkish Lira" },
  { code: "ZAR", label: "South African Rand" },
  { code: "BRL", label: "Brazilian Real" },
  { code: "MXN", label: "Mexican Peso" },
  { code: "NGN", label: "Nigerian Naira" },
  { code: "KRW", label: "South Korean Won" },
  { code: "RUB", label: "Russian Ruble" },
];
