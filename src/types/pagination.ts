/**
 * Pagination contract as per integration.md:
 * - Request: query params `page` (1-based), `limit` (or `pageSize`)
 * - Response: { data: T[], total: number, page: number, totalPages?: number }
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages?: number;
}

export function getTotalPages(total: number, limit: number): number {
  return limit > 0 ? Math.ceil(total / limit) : 0;
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;
