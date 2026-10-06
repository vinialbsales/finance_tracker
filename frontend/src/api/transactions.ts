// Funções que chamam /api/transactions (getAll, getById, create, update via PATCH, remove),
// tipadas com os tipos de types/transaction.ts. Usa a instância de api/axiosClient.ts.
import { api } from "./axiosClient";
import type { TransactionRequest } from "../types/transaction";
import type { TransactionResponse } from "../types/transaction";

export async function createTransaction(request: TransactionRequest): Promise<TransactionResponse> {
  const response = await api.post<TransactionResponse>("/transactions", request);
  return response.data;
}

export async function listAllTransactions(): Promise<TransactionResponse[]> {
  const response = await api.get<TransactionResponse[]>("/transactions");
  return response.data;
}

export async function getTransaction(id: number): Promise<TransactionResponse> {
  const response = await api.get<TransactionResponse>(`/transactions/${id}`);
  return response.data;
}

export async function patchTransaction(id: number, request: Partial<TransactionRequest>): Promise<TransactionResponse> {
  const response = await api.patch<TransactionResponse>(`/transactions/${id}`, request);
  return response.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
