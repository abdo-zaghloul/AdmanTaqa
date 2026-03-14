import axiosInstance from "@/api/config";
import type {
  JobOrdersWebListParams,
  JobOrdersWebListResponse,
} from "@/types/jobOrdersWeb";
import type { ProviderJobOrderItem } from "@/types/provider";

/** Normalize PascalCase to camelCase for job order (same as providerService for compatibility). */
function normalizeJobOrderWebItem(raw: Record<string, unknown>): ProviderJobOrderItem {
  const out: Record<string, unknown> = { ...raw };
  if (raw.PaymentRecord !== undefined) out.paymentRecord = raw.PaymentRecord;
  if (raw.ExternalRequest !== undefined) out.externalRequest = raw.ExternalRequest;
  if (raw.ProviderQuote !== undefined) out.providerQuote = raw.ProviderQuote;
  if (raw.ExternalJobAssignments !== undefined) out.externalJobAssignments = raw.ExternalJobAssignments;
  if (raw.ExternalJobVisits !== undefined) out.externalJobVisits = raw.ExternalJobVisits;
  if (raw.MaintenanceReports !== undefined) out.maintenanceReports = raw.MaintenanceReports;
  if (raw.ExecutionDetails !== undefined) out.executionDetails = raw.ExecutionDetails;
  return out as unknown as ProviderJobOrderItem;
}

function normalizeList(res: JobOrdersWebListResponse): { items: ProviderJobOrderItem[]; total: number; page: number; limit: number } {
  const data = res?.data;
  if (!data || typeof data !== "object") {
    return { items: [], total: 0, page: 1, limit: 20 };
  }
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items = rawItems.map((item) =>
    normalizeJobOrderWebItem(typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {})
  );
  return {
    items,
    total: typeof data.total === "number" ? data.total : items.length,
    page: typeof data.page === "number" ? data.page : 1,
    limit: typeof data.limit === "number" ? data.limit : 20,
  };
}

/**
 * GET /api/job-orders-web — list external job orders for service provider (full includes).
 * No operator filter — all orders for the organization.
 */
export async function fetchJobOrdersWebList(
  params?: JobOrdersWebListParams
): Promise<{ items: ProviderJobOrderItem[]; total: number; page: number; limit: number }> {
  const query: Record<string, string> = {};
  if (params?.page != null) query.page = String(params.page);
  if (params?.limit != null) query.limit = String(params.limit);
  if (params?.status != null && params.status !== "") query.status = params.status;
  const qs = new URLSearchParams(query).toString();
  const url = qs ? `job-orders-web?${qs}` : "job-orders-web";
  const res = await axiosInstance.get<JobOrdersWebListResponse>(url);
  return normalizeList(res.data);
}
