// Types equivalent to the backend's TransactionRequestDTO / TransactionResponseDTO.

export type TransactionType = "EXPENSE" | "INCOME"

export type TransactionRequest = {
  name: string;
  categoryId: number;
  amount: string;
  type: TransactionType;
  date: string;
}

export type TransactionResponse = {
  id: number;
  name: string;
  categoryId: number;
  amount: string;
  type: TransactionType;
  date: string | null;
  createdAt: string;
  updatedAt: string;
}
