import axiosInstance from "@/api/config";
import type {
  QuotationsWebListParams,
  QuotationsWebListResponse,
  QuotationsWebListData,
  QuotationsWebDetailResponse,
  QuotationsWebDetail,
} from "@/types/quotationsWeb";

const BASE = "quotations-web";

function normalizeList(res: QuotationsWebListResponse): QuotationsWebListData {
  const data = res?.data;
  if (!data || typeof data !== "object") {
    return { items: [], total: 0, page: 1, limit: 20 };
  }
  const items = Array.isArray(data.items) ? data.items : [];
  return {
    items,
    total: typeof data.total === "number" ? data.total : items.length,
    page: typeof data.page === "number" ? data.page : 1,
    limit: typeof data.limit === "number" ? data.limit : 20,
    totalPages: typeof data.totalPages === "number" ? data.totalPages : undefined,
  };
}

/**
 * GET /api/quotations-web — list provider quotes (pagination + status filter).
 * Service Provider only.
 */
export async function fetchQuotationsWebList(
  params?: QuotationsWebListParams
): Promise<QuotationsWebListData> {
  const query: Record<string, string> = {};
  if (params?.page != null) query.page = String(params.page);
  if (params?.limit != null) query.limit = String(params.limit);
  if (params?.status != null && params.status !== "") query.status = params.status;
  const qs = new URLSearchParams(query).toString();
  const url = qs ? `${BASE}?${qs}` : BASE;
  const res = await axiosInstance.get<QuotationsWebListResponse>(url);
  return normalizeList(res.data);
}

/**
 * GET /api/quotations-web/:id — single quote detail.
 * Service Provider only.
 */
export async function fetchQuotationsWebById(
  id: number | string
): Promise<QuotationsWebDetail | null> {
  const res = await axiosInstance.get<QuotationsWebDetailResponse>(`${BASE}/${id}`);
  return res.data?.data ?? null;
}
