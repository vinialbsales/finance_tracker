// Ações por linha da listagem de transações (editar, e excluir com confirmação inline).

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteTransaction } from "../../hooks/useTransactions";
import { iconButtonClass } from "../../lib/ui";

const textButtonClass =
  "rounded-md px-2 py-1 text-xs font-medium transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-50";

type TransactionActionsProps = {
  transactionId: number;
  transactionName: string;
  isEditing: boolean;
  onEdit: () => void;
};

// Hooks take the id at call time, so each row gets its own instance.
export function TransactionActions({ transactionId, transactionName, isEditing, onEdit }: TransactionActionsProps) {
  const [confirming, setConfirming] = useState(false);
  const deleteTransaction = useDeleteTransaction(transactionId);

  if (confirming) {
    return (
      <div className="flex items-center gap-1" role="group" aria-label={`Confirmar exclusão de ${transactionName}`}>
        <span className="mr-1 text-xs text-zinc-500">Excluir?</span>
        <button
          type="button"
          onClick={() => deleteTransaction.mutate()}
          disabled={deleteTransaction.isPending}
          className={`${textButtonClass} bg-zinc-900 text-white hover:bg-zinc-700`}
        >
          {deleteTransaction.isPending ? "…" : "Sim"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={deleteTransaction.isPending}
          className={`${textButtonClass} text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900`}
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Editar ${transactionName}`}
        aria-pressed={isEditing}
        title="Editar"
        className={`${iconButtonClass} ${isEditing ? "bg-zinc-100 text-zinc-900" : ""}`}
      >
        <Pencil className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Excluir ${transactionName}`}
        title="Excluir"
        className={iconButtonClass}
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </>
  );
}
