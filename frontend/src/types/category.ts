// Types equivalent to the backend's CategoryRequestDTO / CategoryResponseDTO.

export type CategoryRequest = {
  name: string;
  color?: string;
}

export type CategoryResponse = {
  id: number;
  name: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}
