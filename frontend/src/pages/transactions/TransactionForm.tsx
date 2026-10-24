// Formulário de criar/editar transação.

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useCreateTransaction, usePatchTransaction } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import type { TransactionResponse, TransactionType } from "../../types/transaction";
import type { CategoryResponse } from "../../types/category";
import { CategoryDot } from "../../components/ui/CategoryDot";
import {
  errorTextClass,
  helperTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  segmentedGroupClass,
  segmentedOptionClass,
} from "../../lib/ui";

// Local calendar day as "YYYY-MM-DD" (the en-CA locale formats dates that way).
function today() {
  return new Date().toLocaleDateString("en-CA");
}

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "EXPENSE", label: "Despesa" },
  { value: "INCOME", label: "Receita" },
];

// "12.34" -> "1234": the amount input keeps its value as a string of cents.
// Done on the string so the decimal amount never goes through floating point.
function toCentDigits(amount: string) {
  const [integer, fraction = ""] = amount.split(".");
  return String(Number(integer + (fraction + "00").slice(0, 2)));
}

type TransactionFormProps = {
  // When present the form edits this transaction; otherwise it creates a new one.
  transaction?: TransactionResponse;
  category?: CategoryResponse;
  onDone?: () => void;
};

export function TransactionForm({ transaction, category, onDone }: TransactionFormProps) {
  const isEditing = transaction !== undefined;
  const [name, setName] = useState(transaction?.name ?? "");
  const [amount, setAmount] = useState(transaction ? toCentDigits(transaction.amount) : "0");
  const [amountError, setAmountError] = useState(false);
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "EXPENSE");
  const [date, setDate] = useState(transaction?.date ?? today());
  const [categoryId, setCategoryId] = useState("");
  const createTransaction = useCreateTransaction();
  // Hooks can't be called conditionally; in create mode this instance is simply never used.
  const patchTransaction = usePatchTransaction(transaction?.id ?? 0);
  const mutation = isEditing ? patchTransaction : createTransaction;
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const needsCategory = type === "EXPENSE";
  // Editing can't add a category, so an income saved without one can't become an expense.
  const canBecomeExpense = !isEditing || transaction.categoryId != null;

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    // Income doesn't take a category; drop any selection so a stale one isn't submitted.
    if (nextType === "INCOME") setCategoryId("");
  }

  function formatCurrency(amount: string) {
    const cents = Number(amount);
    return (cents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Number(amount) < 1) {
      setAmountError(true);
      return;
    }

    if (isEditing) {
      // The category is fixed once a transaction exists, so it is never part of the patch.
      patchTransaction.mutate({ name: name, amount: (Number(amount) / 100).toFixed(2), type: type, date: date }, {
        onSuccess: () => onDone?.()
      });
      return;
    }

    createTransaction.mutate({ name: name, amount: (Number(amount) / 100).toFixed(2), type: type, date: date, ...(needsCategory && { categoryId: Number(categoryId) }) }, {
      onSuccess: () => {
        setName("");
        setAmount("");
        setAmountError(false);
      }
    });
  }

  const hasCategories = (categories?.length ?? 0) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5">
      <fieldset>
        <legend className={labelClass}>Tipo</legend>
        <div className={`mt-1.5 grid grid-cols-2 ${segmentedGroupClass}`}>
          {TYPE_OPTIONS.map((option) => (
            <label key={option.value} className={`${segmentedOptionClass} px-3 text-sm`}>
              <input
                type="radio"
                name={isEditing ? "transaction-type-edit" : "transaction-type"}
                value={option.value}
                checked={type === option.value}
                onChange={() => handleTypeChange(option.value)}
                disabled={option.value === "EXPENSE" && !canBecomeExpense}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        {!canBecomeExpense && (
          <p className={helperTextClass}>Receitas sem categoria não podem virar despesa.</p>
        )}
      </fieldset>

      <div>
        <label htmlFor="transaction-name" className={labelClass}>Descrição</label>
        <input
          id="transaction-name"
          type="text"
          required
          // Editing opens from a row's button: move focus (and the viewport) to the form.
          autoFocus={isEditing}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Supermercado"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 min-[400px]:grid-cols-2 min-[400px]:gap-3">
        <div className="min-w-0">
          <label htmlFor="transaction-amount" className={labelClass}>Valor (R$)</label>
          <input
            id="transaction-amount"
            type="text"
            inputMode="decimal"
            required
            value={formatCurrency(amount)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "")
              setAmount(digits || "0")
            }}
            placeholder="0,00"
            aria-invalid={amountError || undefined}
            aria-describedby={amountError ? "transaction-amount-error" : undefined}
            className={`${inputClass} tabular-nums`}
          />
          {amountError && (
            <p id="transaction-amount-error" role="alert" className={errorTextClass}>
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              O valor mínimo é R$ 0,01
            </p>
          )}
        </div>
        <div className="min-w-0">
          <label htmlFor="transaction-date" className={labelClass}>Data</label>
          <input
            id="transaction-date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {isEditing ? (
        transaction.categoryId != null && (
          <div>
            <p className={labelClass}>Categoria</p>
            <p className="mt-1.5 flex items-center gap-2 py-2 text-sm text-zinc-900">
              <CategoryDot color={category?.color} />
              {category?.name ?? "Sem categoria"}
            </p>
            <p className="text-xs text-zinc-500">A categoria não pode ser alterada.</p>
          </div>
        )
      ) : (
        needsCategory && (
          <div>
            <label htmlFor="transaction-category" className={labelClass}>Categoria</label>
            <select
              id="transaction-category"
              required
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              disabled={categoriesLoading || !hasCategories}
              className={inputClass}
            >
              <option value="" disabled>
                {categoriesLoading ? "Carregando…" : hasCategories ? "Selecione" : "Nenhuma categoria disponível"}
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        )
      )}

      <button type="submit" disabled={mutation.isPending || (!isEditing && needsCategory && !hasCategories)} className={primaryButtonClass}>
        {mutation.isPending ? "Salvando…" : isEditing ? "Salvar alterações" : "Adicionar transação"}
      </button>

      {mutation.isError && (
        <p role="alert" className="flex items-start gap-1.5 text-xs text-danger">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Não foi possível salvar a transação. Confira os campos e tente novamente.
        </p>
      )}
    </form>
  )
}
