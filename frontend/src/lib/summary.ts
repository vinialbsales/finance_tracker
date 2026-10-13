// Client-side aggregation for the dashboard. The backend has no aggregate
// endpoints yet, so totals are derived from the full transaction list.
// Amounts are summed in integer cents and only converted back for display.

import type { CategoryResponse } from "../types/category";
import type { TransactionResponse } from "../types/transaction";
import { fromCents, toCents } from "./format";
import { FALLBACK_CATEGORY_COLOR } from "./ui";

export type CategoryTotal = {
  categoryId: number;
  name: string;
  color: string;
  total: number;
  share: number;
};

export type TransactionSummary = {
  income: number;
  expense: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  expensesByCategory: CategoryTotal[];
};

export function summarizeTransactions(
  transactions: TransactionResponse[],
  categories: CategoryResponse[],
): TransactionSummary {
  let incomeCents = 0;
  let expenseCents = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  const expenseCentsByCategory = new Map<number, number>();

  for (const transaction of transactions) {
    const cents = toCents(transaction.amount);

    if (transaction.type === "INCOME") {
      incomeCents += cents;
      incomeCount += 1;
    } else {
      expenseCents += cents;
      expenseCount += 1;
      // The backend requires a category on every expense; the guard only narrows the type.
      if (transaction.categoryId != null) {
        expenseCentsByCategory.set(
          transaction.categoryId,
          (expenseCentsByCategory.get(transaction.categoryId) ?? 0) + cents,
        );
      }
    }
  }

  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  const expensesByCategory = [...expenseCentsByCategory.entries()]
    .map(([categoryId, cents]) => {
      const category = categoriesById.get(categoryId);
      return {
        categoryId,
        name: category?.name ?? "Sem categoria",
        color: category?.color ?? FALLBACK_CATEGORY_COLOR,
        total: fromCents(cents),
        share: expenseCents === 0 ? 0 : cents / expenseCents,
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    income: fromCents(incomeCents),
    expense: fromCents(expenseCents),
    balance: fromCents(incomeCents - expenseCents),
    incomeCount,
    expenseCount,
    expensesByCategory,
  };
}
