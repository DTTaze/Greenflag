export interface PaginatedResponse<T> {
  rows: T;
  limit: number;
  total: number;
  offset: number;
}

export interface SearchParams {
  limit?: number;
  offset?: number;
  keyword?: string;
}
