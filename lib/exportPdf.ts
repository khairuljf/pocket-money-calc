import dayjs from "dayjs";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import type { SortOrder, Transaction } from "../types";

type ExportArgs = {
  transactions: Transaction[];
  monthFilter: string | null;
  dayFilter: string | null;
  sortOrder: SortOrder;
  formatNegative: (amount: number) => string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildScopeLabel(
  monthFilter: string | null,
  dayFilter: string | null,
): string {
  if (dayFilter) return dayjs(dayFilter).format("DD MMM YYYY");
  if (monthFilter) return dayjs(`${monthFilter}-01`).format("MMMM YYYY");
  return "All transactions";
}

function buildHtml(args: ExportArgs): string {
  const { transactions, monthFilter, dayFilter, sortOrder, formatNegative } =
    args;

  const sorted = [...transactions].sort((a, b) => {
    const av = dayjs(a.createdAt).valueOf();
    const bv = dayjs(b.createdAt).valueOf();
    return sortOrder === "asc" ? av - bv : bv - av;
  });

  const total = sorted.reduce((sum, t) => sum + t.amount, 0);
  const scope = buildScopeLabel(monthFilter, dayFilter);
  const sortLabel = sortOrder === "asc" ? "Oldest first" : "Newest first";
  const generatedAt = dayjs().format("DD MMM YYYY, hh:mm A");

  const rows = sorted
    .map((tx, idx) => {
      const d = dayjs(tx.createdAt);
      return `
        <tr>
          <td class="num">${idx + 1}</td>
          <td>${d.format("DD MMM YYYY")}<div class="time">${d.format("hh:mm A")}</div></td>
          <td>${escapeHtml(tx.reason)}</td>
          <td class="amount">${escapeHtml(formatNegative(tx.amount))}</td>
        </tr>
      `;
    })
    .join("");

  const empty =
    sorted.length === 0
      ? `<tr><td colspan="4" class="empty">No transactions for this filter.</td></tr>`
      : "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Pocket Money — ${escapeHtml(scope)}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #0f172a; margin: 32px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      .meta { color: #475569; font-size: 12px; margin-bottom: 20px; }
      .summary { display: flex; gap: 24px; padding: 12px 16px; background: #f1f5f9; border-radius: 10px; margin-bottom: 18px; font-size: 13px; }
      .summary b { color: #0f172a; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
      th { background: #f8fafc; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.04em; }
      td.num, th.num { width: 36px; color: #94a3b8; }
      td.amount, th.amount { text-align: right; color: #e11d48; font-weight: 600; white-space: nowrap; }
      .time { color: #94a3b8; font-size: 10px; margin-top: 2px; }
      .empty { text-align: center; color: #94a3b8; padding: 24px 0; }
      tfoot td { font-weight: 700; padding-top: 14px; border-top: 2px solid #cbd5e1; border-bottom: none; }
      tfoot td.amount { color: #e11d48; }
    </style>
  </head>
  <body>
    <h1>Pocket Money — ${escapeHtml(scope)}</h1>
    <div class="meta">Generated ${generatedAt} · ${sortLabel}</div>
    <div class="summary">
      <div><b>${sorted.length}</b> transactions</div>
      <div>Total spent: <b>${escapeHtml(formatNegative(total))}</b></div>
    </div>
    <table>
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Date</th>
          <th>Reason</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        ${empty}
      </tbody>
      ${
        sorted.length > 0
          ? `<tfoot>
              <tr>
                <td colspan="3">Total</td>
                <td class="amount">${escapeHtml(formatNegative(total))}</td>
              </tr>
            </tfoot>`
          : ""
      }
    </table>
  </body>
</html>`;
}

function buildFileName(
  monthFilter: string | null,
  dayFilter: string | null,
): string {
  const stamp = dayFilter
    ? dayFilter
    : monthFilter
      ? monthFilter
      : `all-${dayjs().format("YYYY-MM-DD")}`;
  return `pocket-money-${stamp}.pdf`;
}

export async function exportTransactionsPdf(args: ExportArgs): Promise<void> {
  try {
    const html = buildHtml(args);
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    const targetName = buildFileName(args.monthFilter, args.dayFilter);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: "com.adobe.pdf",
        mimeType: "application/pdf",
        dialogTitle: targetName,
      });
      return;
    }

    Alert.alert("Saved", `PDF saved to:\n${uri}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    Alert.alert("Could not export PDF", msg);
  }
}
