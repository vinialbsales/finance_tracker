// Types equivalent to the backend's TransactionRequestDTO / TransactionResponseDTO.

export type TransactionType = "EXPENSE" | "INCOME"

export type TransactionRequest = {
  name: string;
  // Required for EXPENSE; omitted for INCOME (the backend returns 400 for an expense without one).
  categoryId?: number;
  amount: string;
  type: TransactionType;
  date: string;
}

export type TransactionResponse = {
  id: number;
  name: string;
  // null for INCOME transactions saved without a category.
  categoryId: number | null;
  amount: string;
  type: TransactionType;
  date: string;
  createdAt: string;
  updatedAt: string;
}
