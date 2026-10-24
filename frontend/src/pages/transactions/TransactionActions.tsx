// Ações por linha da listagem de transações (editar, e excluir com confirmação inline).

import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useDeleteTransaction } from "../../hooks/useTransactions";
import { focusRingClass, iconButtonClass } from "../../lib/ui";

const textButtonClass =
  `rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-2 sm:py-1 ${focusRingClass} ` +
  "disabled:cursor-not-allowed disabled:opacity-50";

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
  // The trash button unmounts while confirming; on cancel, focus goes back to it
  // instead of falling to <body>.
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (!confirming && restoreFocus.current) {
      restoreFocus.current = false;
      deleteButtonRef.current?.focus();
    }
  }, [confirming]);

  function cancelConfirm() {
    restoreFocus.current = true;
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label={`Confirmar exclusão de ${transactionName}`}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !deleteTransaction.isPending) cancelConfirm();
        }}
      >
        <span className="mr-1 text-xs text-zinc-500">Excluir?</span>
        <button
          type="button"
          onClick={() => deleteTransaction.mutate()}
          disabled={deleteTransaction.isPending}
          aria-busy={deleteTransaction.isPending}
          className={`${textButtonClass} bg-zinc-900 text-white hover:bg-zinc-700 active:bg-zinc-800`}
        >
          {deleteTransaction.isPending ? (
            <>
              <span aria-hidden="true">…</span>
              <span className="sr-only">Excluindo</span>
            </>
          ) : (
            "Sim"
          )}
        </button>
        {/* The safe choice gets focus first, so Enter on the trash button can't delete by accident. */}
        <button
          type="button"
          autoFocus
          onClick={cancelConfirm}
          disabled={deleteTransaction.isPending}
          className={`${textButtonClass} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200`}
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
        ref={deleteButtonRef}
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
