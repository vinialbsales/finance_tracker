// Formulário de criar/editar transação.

import React, { useState } from "react";
import { useCreateTransaction } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import type { TransactionType } from "../../types/transaction";
import { inputClass, labelClass, primaryButtonClass } from "../../lib/ui";

// Local calendar day as "YYYY-MM-DD" (the en-CA locale formats dates that way).
function today() {
  return new Date().toLocaleDateString("en-CA");
}

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "EXPENSE", label: "Despesa" },
  { value: "INCOME", label: "Receita" },
];

export function TransactionForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [date, setDate] = useState(today);
  const [categoryId, setCategoryId] = useState("");
  const createTransaction = useCreateTransaction();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    createTransaction.mutate({ name: name, amount: amount, type: type, date: date, categoryId: Number(categoryId) }, {
      onSuccess: () => {
        setName("");
        setAmount("");
      }
    });
  }

  const hasCategories = (categories?.length ?? 0) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-5">
      <fieldset>
        <legend className={labelClass}>Tipo</legend>
        <div className="mt-1.5 grid grid-cols-2 rounded-md border border-zinc-200 p-0.5">
          {TYPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-[5px] px-3 py-1.5 text-center text-sm text-zinc-500 transition-colors has-checked:bg-zinc-900 has-checked:font-medium has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-zinc-900"
            >
              <input
                type="radio"
                name="transaction-type"
                value={option.value}
                checked={type === option.value}
                onChange={() => setType(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="transaction-name" className={labelClass}>Descrição</label>
        <input
          id="transaction-name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Supermercado"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="transaction-amount" className={labelClass}>Valor (R$)</label>
          <input
            id="transaction-amount"
            type="number"
            inputMode="decimal"
            required
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0,00"
            className={`${inputClass} tabular-nums`}
          />
        </div>
        <div>
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
            {categoriesLoading ? "Carregando…" : hasCategories ? "Selecione" : "Crie uma categoria primeiro"}
          </option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={createTransaction.isPending || !hasCategories} className={primaryButtonClass}>
        {createTransaction.isPending ? "Salvando…" : "Adicionar transação"}
      </button>

      {createTransaction.isError && (
        <p role="alert" className="text-xs text-zinc-600">
          Não foi possível salvar a transação. Confira os campos e tente novamente.
        </p>
      )}
    </form>
  )
}
