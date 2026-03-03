import axiosInstance from "@/api/config";
import type {
  ProviderRfqItem,
  ProviderRfqDetail,
  ProviderQuoteItem,
  CreateQuoteBody,
  ProviderJobOrderItem,
  ProviderJobOrderDetail,
  ConfirmReceivedBody,
  ProviderRfqsListResponse,
  ProviderJobOrdersListResponse,
  ProviderVisitItem,
  ProviderAttachmentItem,
  ProviderReportItem,
  CreateProviderReportBody,
} from "@/types/provider";

function getErrorMessage(err: unknown, fallback: string): string {
  const withResponse = err as { response?: { data?: { message?: string } } };
  return typeof withResponse.response?.data?.message === "string"
    ? withResponse.response.data.message
    : err instanceof Error
      ? err.message
      : fallback;
}

export async function fetchProviderRfqs(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProviderRfqItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<ProviderRfqsListResponse>("provider/rfqs", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: ProviderRfqItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

export async function fetchProviderRfqById(id: number | string): Promise<ProviderRfqDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderRfqDetail }>(
    `provider/rfqs/${id}`
  );
  return response.data?.data ?? null;
}

export async function createQuoteForRfq(
  rfqId: number | string,
  body: CreateQuoteBody
): Promise<ProviderQuoteItem> {
  const response = await axiosInstance.post<{ success?: boolean; data?: ProviderQuoteItem }>(
    `provider/rfqs/${rfqId}/quotes`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Unexpected create quote response."));
  return item;
}

export async function reviseProviderQuote(
  quoteId: number | string,
  body: Partial<CreateQuoteBody>
): Promise<ProviderQuoteItem> {
  const response = await axiosInstance.patch<{ success?: boolean; data?: ProviderQuoteItem }>(
    `provider/quotes/${quoteId}`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Unexpected revise quote response."));
  return item;
}

export async function withdrawProviderQuote(quoteId: number | string): Promise<unknown> {
  const response = await axiosInstance.post(`provider/quotes/${quoteId}/withdraw`);
  return response.data;
}

export async function fetchProviderJobOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProviderJobOrderItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<ProviderJobOrdersListResponse>("provider/job-orders", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: ProviderJobOrderItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

export async function fetchProviderJobOrderById(
  id: number | string
): Promise<ProviderJobOrderDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderJobOrderDetail }>(
    `provider/job-orders/${id}`
  );
  return response.data?.data ?? null;
}

export async function confirmJobOrderPaymentReceived(
  jobOrderId: number | string,
  body: ConfirmReceivedBody
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/confirm-received`,
    body
  );
  return response.data;
}

export async function assignProviderJobOrderOperator(
  jobOrderId: number | string,
  body: { userId: number }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/assign-operator`,
    body
  );
  return response.data;
}

export async function updateProviderJobOrderStatus(
  jobOrderId: number | string,
  body: { status: string; cancellationReason?: string }
): Promise<unknown> {
  const response = await axiosInstance.patch(
    `provider/job-orders/${jobOrderId}/status`,
    body
  );
  return response.data;
}

/** GET /api/provider/job-orders/:id/visits — list visits */
export async function fetchProviderJobOrderVisits(
  jobOrderId: number | string
): Promise<ProviderVisitItem[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: ProviderVisitItem[];
  }>(`provider/job-orders/${jobOrderId}/visits`);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

/** POST /api/provider/job-orders/:id/visits/checkin — register visit (check-in) */
export async function createProviderJobOrderVisitCheckin(
  jobOrderId: number | string,
  body?: { notes?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/visits/checkin`,
    body ?? {}
  );
  return response.data;
}

/** GET /api/provider/job-orders/:id/attachments — list attachments (if supported) */
export async function fetchProviderJobOrderAttachments(
  jobOrderId: number | string
): Promise<ProviderAttachmentItem[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: ProviderAttachmentItem[];
  }>(`provider/job-orders/${jobOrderId}/attachments`);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

/** POST /api/provider/job-orders/:id/attachments — upload attachment */
export async function uploadProviderJobOrderAttachment(
  jobOrderId: number | string,
  file: File
): Promise<{ id?: number; url?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<{ success?: boolean; data?: { id?: number; url?: string } }>(
    `provider/job-orders/${jobOrderId}/attachments`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data?.data ?? {};
}

/** POST /api/provider/job-orders/:id/submit-completion — send job order for station review (e.g. UNDER_REVIEW) */
export async function submitProviderJobOrderForCompletion(
  jobOrderId: number | string
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/submit-completion`
  );
  return response.data;
}

/** GET /api/provider/job-orders/:id/reports — list maintenance reports for this job order */
export async function fetchProviderJobOrderReports(
  jobOrderId: number | string
): Promise<ProviderReportItem[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: ProviderReportItem[] | { items?: ProviderReportItem[] };
  }>(`provider/job-orders/${jobOrderId}/reports`);
  const data = response.data?.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "items" in data)
    return Array.isArray((data as { items?: ProviderReportItem[] }).items)
      ? (data as { items: ProviderReportItem[] }).items
      : [];
  return [];
}

/** POST /api/provider/job-orders/:id/reports — create maintenance report */
export async function createProviderJobOrderReport(
  jobOrderId: number | string,
  body: CreateProviderReportBody
): Promise<ProviderReportItem> {
  const response = await axiosInstance.post<{ success?: boolean; data?: ProviderReportItem }>(
    `provider/job-orders/${jobOrderId}/reports`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Unexpected create report response."));
  return item;
}

/** PATCH /api/provider/job-orders/:id/reports/:reportId/submit — submit report for review (or POST reports/:id/submit) */
export async function submitProviderJobOrderReport(
  jobOrderId: number | string,
  reportId: number | string
): Promise<unknown> {
  const response = await axiosInstance.patch(
    `provider/job-orders/${jobOrderId}/reports/${reportId}/submit`,
    {}
  );
  return response.data;
}
