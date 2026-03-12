import axiosInstance from "@/api/config";
import { getApiErrorMessage } from "@/lib/utils";
import type {
  AuthorityExternalJobOrdersListParams,
  AuthorityExternalJobOrdersExportParams,
  AuthorityExternalJobOrderListResponse,
  AuthorityExternalJobOrderItem,
  AuthorityExternalJobOrderDetail,
  AuthorityExternalJobOrderDetailResponse,
} from "@/types/authorityExternalJobOrder";

function buildListParams(params?: AuthorityExternalJobOrdersListParams): Record<string, string> {
  const out: Record<string, string> = {};
  if (params?.page != null) out.page = String(params.page);
  if (params?.limit != null) out.limit = String(params.limit);
  if (params?.status != null && params.status.trim() !== "") out.status = params.status.trim();
  if (params?.fromDate) out.fromDate = params.fromDate;
  if (params?.toDate) out.toDate = params.toDate;
  if (params?.datePreset) out.datePreset = params.datePreset;
  if (params?.branchId != null && params.branchId !== "") out.branchId = String(params.branchId);
  if (params?.fuelStationOrganizationId != null && params.fuelStationOrganizationId !== "")
    out.fuelStationOrganizationId = String(params.fuelStationOrganizationId);
  if (params?.providerOrganizationId != null && params.providerOrganizationId !== "")
    out.providerOrganizationId = String(params.providerOrganizationId);
  if (params?.serviceCategoryId != null && params.serviceCategoryId !== "")
    out.serviceCategoryId = String(params.serviceCategoryId);
  return out;
}

/**
 * GET /api/authority/external-job-orders — list with pagination and filters.
 */
export async function fetchAuthorityExternalJobOrders(
  params?: AuthorityExternalJobOrdersListParams
): Promise<{ items: AuthorityExternalJobOrderItem[]; total: number; page?: number; limit?: number }> {
  const query = new URLSearchParams(buildListParams(params)).toString();
  const url = query ? `authority/external-job-orders?${query}` : "authority/external-job-orders";
  const res = await axiosInstance.get<AuthorityExternalJobOrderListResponse>(url);
  const data = res.data?.data;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  return {
    items: items as AuthorityExternalJobOrderItem[],
    total,
    page: data?.page,
    limit: data?.limit,
  };
}

/**
 * GET /api/authority/external-job-orders/export — export as JSON or CSV.
 * For CSV returns blob and triggers download; for JSON returns parsed data and can trigger download.
 */
export async function fetchAuthorityExternalJobOrderExport(
  params?: AuthorityExternalJobOrdersExportParams
): Promise<void> {
  const exportParams = { ...params };
  const format = exportParams?.format ?? "csv";
  const queryParams = buildListParams(exportParams);
  queryParams.format = format;
  const query = new URLSearchParams(queryParams).toString();
  const url = `authority/external-job-orders/export?${query}`;

  if (format === "csv") {
    const res = await axiosInstance.get(url, { responseType: "blob" });
    const blob = res.data as Blob;
    const disposition = res.headers["content-disposition"];
    const filename =
      (typeof disposition === "string" && disposition.includes("filename=")
        ? disposition.split("filename=")[1]?.replace(/^["']|["']$/g, "").trim()
        : null) ?? "authority-job-orders.csv";
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return;
  }

  const res = await axiosInstance.get<{ success?: boolean; data?: unknown[] }>(url);
  const data = res.data?.data;
  const jsonStr = JSON.stringify(data ?? [], null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "authority-job-orders.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * GET /api/authority/external-job-orders/:id — detail (no financial data).
 */
export async function fetchAuthorityExternalJobOrderById(
  id: number | string
): Promise<AuthorityExternalJobOrderDetail | null> {
  const res = await axiosInstance.get<AuthorityExternalJobOrderDetailResponse>(
    `authority/external-job-orders/${id}`
  );
  return res.data?.data ?? null;
}

/**
 * GET /api/authority/external-job-orders/:id/timeline — activity timeline.
 */
export async function fetchAuthorityExternalJobOrderTimeline(
  id: number | string
): Promise<unknown[]> {
  try {
    const res = await axiosInstance.get<{ success?: boolean; data?: unknown[] }>(
      `authority/external-job-orders/${id}/timeline`
    );
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Failed to load timeline."));
  }
}

/**
 * GET /api/authority/external-job-orders/:id/reports — maintenance reports (no financial data).
 */
export async function fetchAuthorityExternalJobOrderReports(
  id: number | string
): Promise<unknown[]> {
  try {
    const res = await axiosInstance.get<{ success?: boolean; data?: unknown[] }>(
      `authority/external-job-orders/${id}/reports`
    );
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(getApiErrorMessage(err, "Failed to load reports."));
  }
}
