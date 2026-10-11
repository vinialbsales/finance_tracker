import type { CategoryResponse } from "../../types/category";
import type { TransactionResponse } from "../../types/transaction";
import { formatCurrency, formatDate } from "../../lib/format";
import { CategoryDot } from "./CategoryDot";

type TransactionRowProps = {
  transaction: TransactionResponse;
  category: CategoryResponse | undefined;
};

// Income is the one place the accent color appears; expenses stay in ink.
// The sign and the "Receita"/"Despesa" label carry the meaning, so it is never color-only.
export function TransactionRow({ transaction, category }: TransactionRowProps) {
  const isIncome = transaction.type === "INCOME";

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900">{transaction.name}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
          <CategoryDot color={category?.color} />
          <span className="truncate">{category?.name ?? "Sem categoria"}</span>
          <span aria-hidden="true" className="text-zinc-300">·</span>
          <span className="shrink-0">{formatDate(transaction.date ?? transaction.createdAt)}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-sm font-medium tabular-nums ${isIncome ? "text-accent" : "text-zinc-900"}`}>
          {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
        </p>
        <p className="mt-1 text-xs text-zinc-400">{isIncome ? "Receita" : "Despesa"}</p>
      </div>
    </li>
  );
}
