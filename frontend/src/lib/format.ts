// Display-only formatting helpers. Amounts arrive from the API as strings
// (BigDecimal serialized as text); these functions convert them only to render.

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

// The backend sends LocalDate ("2026-10-11") with no timezone. Formatting in UTC
// keeps the calendar day intact instead of shifting it to the previous day in
// negative-offset zones like America/Sao_Paulo.
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCurrency(value: number | string): string {
  return currencyFormatter.format(Number(value));
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate.slice(0, 10)));
}

// Sums are done in integer cents so totals like 0.1 + 0.2 don't drift.
export function toCents(amount: string): number {
  return Math.round(Number(amount) * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatPercent(fraction: number): string {
  return fraction.toLocaleString("pt-BR", { style: "percent", maximumFractionDigits: 1 });
}
