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
  CreateProviderVisitBody,
  CreateProviderVisitCheckinBody,
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

/** Normalize job order from API: backend may return PascalCase (PaymentRecord, ExternalRequest, ...). */
function normalizeProviderJobOrder(raw: Record<string, unknown>): Record<string, unknown> {
  const out = { ...raw };
  if (raw.PaymentRecord !== undefined) out.paymentRecord = raw.PaymentRecord;
  if (raw.ExternalRequest !== undefined) out.externalRequest = raw.ExternalRequest;
  if (raw.ProviderQuote !== undefined) out.providerQuote = raw.ProviderQuote;
  if (raw.ExternalJobAssignments !== undefined) out.externalJobAssignments = raw.ExternalJobAssignments;
  return out;
}

/**
 * Doc (work-order-flow 3.1): قائمة طلبات العرض للمزود = GET /api/provider/rfqs (query: status, page, limit)
 */
export async function fetchProviderRfqs(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProviderRfqItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<ProviderRfqsListResponse>("provider/rfqs", {
    params: { page: params?.page ?? 1, limit: params?.limit ?? 20, ...(params?.status && { status: params.status }) },
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: ProviderRfqItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

/**
 * Doc (work-order-flow 3.2): تفاصيل RFQ = GET /api/provider/rfqs/:id
 */
export async function fetchProviderRfqById(id: number | string): Promise<ProviderRfqDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderRfqDetail }>(
    `provider/rfqs/${id}`
  );
  return response.data?.data ?? null;
}

/**
 * Doc: Confirm Received — PATCH /requests/{id} مع body مثل { "status": "RECEIVED" }
 */
export async function patchRequestConfirmReceived(
  requestId: number | string,
  body: { status?: string } = { status: "RECEIVED" }
): Promise<unknown> {
  const response = await axiosInstance.patch(`requests/${requestId}`, body);
  return response.data;
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

/**
 * Doc (work-order-flow): قائمة أوامر المزود = GET /api/provider/job-orders (query: status, page, limit)
 */
export async function fetchProviderJobOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProviderJobOrderItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<ProviderJobOrdersListResponse>("provider/job-orders", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const rawItems = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? [];
  const items: ProviderJobOrderItem[] = rawItems.map((item) =>
    normalizeProviderJobOrder(item as Record<string, unknown>) as unknown as ProviderJobOrderItem
  );
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

/**
 * Doc (work-order-flow): تفاصيل أمر عمل للمزود = GET /api/provider/job-orders/:id
 */
export async function fetchProviderJobOrderById(
  id: number | string
): Promise<ProviderJobOrderDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderJobOrderDetail }>(
    `provider/job-orders/${id}`
  );
  const raw = response.data?.data ?? null;
  return raw
    ? (normalizeProviderJobOrder(raw as unknown as Record<string, unknown>) as unknown as ProviderJobOrderDetail)
    : null;
}

/** Body لـ POST /job-orders حسب التوثيق (CreateWorkOrderRequest) */
export interface CreateJobOrderBody {
  title: string;
  description: string;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  type?: string;
  gasStationId?: number;
  assignedToId?: number;
  scheduledAt?: string;
  requestId?: number;
}

/**
 * Doc: إنشاء Job Order = POST /job-orders
 */
export async function createJobOrder(body: CreateJobOrderBody): Promise<ProviderJobOrderDetail> {
  const response = await axiosInstance.post<{ success?: boolean; data?: ProviderJobOrderDetail }>(
    "job-orders",
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Create job order failed."));
  return normalizeProviderJobOrder(item as unknown as Record<string, unknown>) as unknown as ProviderJobOrderDetail;
}

/**
 * Doc: تحديث Job Order = PUT /job-orders/{id}
 */
export async function updateJobOrder(
  id: number | string,
  body: Partial<CreateJobOrderBody>
): Promise<ProviderJobOrderDetail> {
  const response = await axiosInstance.put<{ success?: boolean; data?: ProviderJobOrderDetail }>(
    `job-orders/${id}`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Update job order failed."));
  return normalizeProviderJobOrder(item as unknown as Record<string, unknown>) as unknown as ProviderJobOrderDetail;
}

/**
 * Doc: حذف Job Order = DELETE /job-orders/{id}
 */
export async function deleteJobOrder(id: number | string): Promise<unknown> {
  const response = await axiosInstance.delete(`job-orders/${id}`);
  return response.data;
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

/** Doc (7.1): تعيين عامل — الـ API يتوقع body.operatorId (رقم). نرسل userId من الواجهة كـ operatorId. */
export async function assignProviderJobOrderOperator(
  jobOrderId: number | string,
  body: { operatorId?: number; userId?: number }
): Promise<unknown> {
  const operatorId = body.operatorId ?? body.userId;
  if (operatorId == null || typeof operatorId !== "number") {
    throw new Error("operatorId is required (number).");
  }
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/assign-operator`,
    { operatorId }
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

/** POST /api/provider/job-orders/:id/visits — create visit (type: EXECUTION | INSPECTION | FOLLOW_UP). */
export async function createProviderVisit(
  jobOrderId: number | string,
  body: CreateProviderVisitBody
): Promise<ProviderVisitItem> {
  const payload: Record<string, unknown> = {
    type: body.type,
    ...(body.scheduledAt && { scheduledAt: body.scheduledAt }),
    ...(body.operatorUserId != null && { operatorUserId: body.operatorUserId }),
    ...(body.notes != null && body.notes !== "" && { notes: body.notes }),
  };
  const response = await axiosInstance.post<{ success?: boolean; data?: ProviderVisitItem }>(
    `provider/job-orders/${jobOrderId}/visits`,
    payload
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Create visit failed."));
  return item;
}

/** Doc (7.5): GET /api/provider/visits/:visitId — تفاصيل زيارة */
export async function fetchProviderVisitById(visitId: number | string): Promise<ProviderVisitItem | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderVisitItem }>(
    `provider/visits/${visitId}`
  );
  return response.data?.data ?? null;
}

/** Doc (7.10): POST /api/provider/visits/:visitId/complete — إكمال الزيارة (اختياري completionNote). */
export async function completeProviderVisit(
  visitId: number | string,
  body?: { completionNote?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/visits/${visitId}/complete`,
    body ?? {}
  );
  return response.data;
}

/** Doc (7.6): POST /api/provider/visits/:visitId/checkin — تسجيل وصول للزيارة (body: method GPS|QR|MANUAL, notes). */
export async function checkinProviderVisit(
  visitId: number | string,
  body?: { method?: "GPS" | "QR" | "MANUAL"; notes?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/visits/${visitId}/checkin`,
    body ?? { method: "MANUAL" }
  );
  return response.data;
}

/** Doc (7.7): POST /api/provider/visits/:visitId/notes — إضافة ملاحظة للزيارة */
export async function addProviderVisitNote(
  visitId: number | string,
  body: { note: string }
): Promise<unknown> {
  const response = await axiosInstance.post(`provider/visits/${visitId}/notes`, body);
  return response.data;
}

/** Doc (7.8): POST /api/provider/visits/:visitId/attachments — مرفق لزيارة (body: fileUrl, description) */
export async function addProviderVisitAttachment(
  visitId: number | string,
  body: { fileUrl: string; description?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(`provider/visits/${visitId}/attachments`, body);
  return response.data;
}

/** Doc (7.9): POST /api/provider/visits/:visitId/upload-photo — رفع صورة للزيارة (multipart) */
export async function uploadProviderVisitPhoto(
  visitId: number | string,
  file: File
): Promise<{ url?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<{ success?: boolean; data?: { url?: string } }>(
    `provider/visits/${visitId}/upload-photo`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data?.data ?? {};
}

/** Doc (Legacy): POST /api/provider/job-orders/:id/visits/checkin — check-in بدون زيارة مسبقة (arrivalVerificationType, notes). */
export async function createProviderJobOrderVisitCheckin(
  jobOrderId: number | string,
  body?: { arrivalVerificationType?: CreateProviderVisitCheckinBody["arrivalVerificationType"]; notes?: string; visitDate?: string; metadataJson?: object }
): Promise<unknown> {
  const payload: CreateProviderVisitCheckinBody = {
    arrivalVerificationType: body?.arrivalVerificationType ?? "MANUAL",
    ...(body?.notes != null && body.notes !== "" && { notes: body.notes }),
    ...(body?.visitDate && { visitDate: body.visitDate }),
    ...(body?.metadataJson && { metadataJson: body.metadataJson }),
  };
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/visits/checkin`,
    payload
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

/** POST /api/provider/job-orders/:id/attachments/upload — multipart upload (file); backend uploads to storage then adds attachment. */
export async function uploadProviderJobOrderAttachment(
  jobOrderId: number | string,
  file: File,
  description?: string
): Promise<{ id?: number; url?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  if (description != null && description !== "") formData.append("description", description);
  const response = await axiosInstance.post<{ success?: boolean; data?: { jobOrder?: unknown; fileUrl?: string; publicId?: string } }>(
    `provider/job-orders/${jobOrderId}/attachments/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  const data = response.data?.data;
  return data?.fileUrl ? { url: data.fileUrl } : {};
}

/** Doc (7.13): GET /api/provider/job-orders/:id/timeline — تايملاين النشاطات */
export async function fetchProviderJobOrderTimeline(
  jobOrderId: number | string
): Promise<unknown[]> {
  const response = await axiosInstance.get<{ success?: boolean; data?: unknown[] }>(
    `provider/job-orders/${jobOrderId}/timeline`
  );
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

/** Doc (7.18): POST /api/provider/job-orders/:id/submit-completion — تسليم الأمر للمراجعة (body: completionNote اختياري) */
export async function submitProviderJobOrderForCompletion(
  jobOrderId: number | string,
  body?: { completionNote?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/submit-completion`,
    body ?? {}
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

/** Doc (7.16): PATCH /api/provider/reports/:reportId — تحديث تقرير */
export async function updateProviderReport(
  reportId: number | string,
  body: Partial<CreateProviderReportBody>
): Promise<ProviderReportItem> {
  const response = await axiosInstance.patch<{ success?: boolean; data?: ProviderReportItem }>(
    `provider/reports/${reportId}`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Update report failed."));
  return item;
}

/** Doc (7.17): POST /api/provider/reports/:reportId/submit — تقديم تقرير للمراجعة */
export async function submitProviderReport(reportId: number | string): Promise<unknown> {
  const response = await axiosInstance.post(`provider/reports/${reportId}/submit`, {});
  return response.data;
}

/** PATCH /api/provider/job-orders/:id/reports/:reportId/submit — submit report (legacy path) */
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
