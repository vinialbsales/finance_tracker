import type { ReactNode } from "react";
import type { CategoryResponse } from "../../types/category";
import type { TransactionResponse } from "../../types/transaction";
import { formatCurrency, formatDate } from "../../lib/format";
import { CategoryDot } from "./CategoryDot";

type TransactionRowProps = {
  transaction: TransactionResponse;
  category: CategoryResponse | undefined;
  actions?: ReactNode;
  // Marks the row whose transaction is open in the edit form.
  highlighted?: boolean;
};

// Income is the one place the accent color appears; expenses stay in ink.
// The sign and the "Receita"/"Despesa" label carry the meaning, so it is never color-only.
export function TransactionRow({ transaction, category, actions, highlighted = false }: TransactionRowProps) {
  const isIncome = transaction.type === "INCOME";

  return (
    <li
      aria-current={highlighted || undefined}
      className={`@container flex items-center justify-between gap-3 px-5 py-3.5 transition-colors @sm:gap-4 ${highlighted ? "bg-zinc-50" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">{transaction.name}</p>
        {/* Sized by the row, not the viewport: narrow rows (phones, the dashboard's side
            panel) stack category and date so neither gets truncated to a letter. */}
        <div className="mt-1 flex flex-col gap-0.5 text-xs text-zinc-500 @sm:flex-row @sm:items-center @sm:gap-1.5">
          {/* Income may have no category at all: then only the date is shown. */}
          {transaction.categoryId != null && (
            <>
              <span className="flex min-w-0 items-center gap-1.5">
                <CategoryDot color={category?.color} />
                <span className="truncate">{category?.name ?? "Sem categoria"}</span>
              </span>
              <span aria-hidden="true" className="hidden text-zinc-300 @sm:inline">·</span>
            </>
          )}
          <span className="truncate @sm:shrink-0">{formatDate(transaction.date ?? transaction.createdAt)}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-sm font-medium tabular-nums ${isIncome ? "text-accent" : "text-zinc-900"}`}>
          {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
        </p>
        <p className="mt-1 text-xs text-zinc-500">{isIncome ? "Receita" : "Despesa"}</p>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </li>
  );
}
