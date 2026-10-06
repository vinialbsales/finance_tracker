// Types equivalent to the backend's CategoryRequestDTO / CategoryResponseDTO.
import type { TransactionType } from "./transaction";

export type CategoryRequest = {
  name: string;
  type: TransactionType;
  color?: string;
}

export type CategoryResponse = {
  id: number;
  name: string;
  type: TransactionType;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}
