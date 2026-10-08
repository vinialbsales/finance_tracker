// Hook customizado usando React Query, consumindo as funções de api/transactions.ts.
import { createTransaction, listAllTransactions, getTransaction, patchTransaction, deleteTransaction } from "../api/transactions";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import type { TransactionRequest } from "../types/transaction";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: listAllTransactions
  })
}

export function useTransactionById(id: number) {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getTransaction(id)
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: (err) => {
      console.error("Failed to create the Transaction", err);
    }
  })
}

export function usePatchTransaction(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Partial<TransactionRequest>) => patchTransaction(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: (err) => {
      console.error("Failed to update the Transaction", err)
    }
  })
}

export function useDeleteTransaction(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: (err) => {
      console.error("Failed to delete the Transaction", err)
    }
  })
}
