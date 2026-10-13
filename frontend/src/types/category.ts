// Type equivalent to the backend's CategoryResponseDTO.

export type CategoryResponse = {
  id: number;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}
