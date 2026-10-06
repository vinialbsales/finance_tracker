// Types equivalent to the backend's TransactionRequestDTO / TransactionResponseDTO.

export type TransactionType = "EXPENSE" | "INCOME"

export type TransactionRequest = {
  categoryId: number;
  amount: string;
  type: TransactionType;
  date: string;
}

export type TransactionResponse = {
  id: number;
  categoryId: number;
  amount: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}
