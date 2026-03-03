import axiosInstance from "@/api/config";
import type {
  MaintenanceRequestBody,
  CreateMaintenanceRequestResponse,
  StationRequestItem,
  StationRequestDetail,
  StationRequestsListResponse,
  LinkedProviderItem,
  ConfirmSentBody,
  LinkedProviderForRequest,
  CreateRequestPayload,
  CreateRequestResponse,
  StationJobOrderListItem,
  StationJobOrderListResponse,
} from "@/types/station";

export async function createMaintenanceRequest(
  body: MaintenanceRequestBody
): Promise<CreateMaintenanceRequestResponse["data"]> {
  const response = await axiosInstance.post<CreateMaintenanceRequestResponse>(
    "station/maintenance-requests",
    body
  );
  if (!response.data?.success && response.data?.data == null) {
    throw new Error(response.data?.message ?? "Failed to create maintenance request.");
  }
  return response.data.data;
}

export async function fetchStationRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: StationRequestItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<StationRequestsListResponse>("station/requests", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: StationRequestItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

/** Raw service request from GET /api/requests/:id */
interface ServiceRequestApiResponse {
  id: number;
  branchId?: number | null;
  requestedByUserId?: number | null;
  formData?: { description?: string; priority?: string; [key: string]: unknown };
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  Branch?: StationRequestDetail["Branch"];
  quotes?: StationRequestItem["quotes"];
  jobOrders?: StationRequestDetail["jobOrders"];
  cancellationReason?: string | null;
  selectedQuoteId?: number | null;
}

/** GET /api/station/requests/:id — station request detail (internal-external-orders guide) */
export async function fetchStationRequestById(
  id: number | string
): Promise<StationRequestDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ServiceRequestApiResponse }>(
    `station/requests/${id}`
  );
  const raw = response.data?.data;
  if (!raw) return null;
  const description = (raw.formData?.description as string) ?? (raw as { title?: string }).title ?? "";
  return {
    ...raw,
    title: (raw as { title?: string }).title ?? (description || `Request #${raw.id}`),
    description: description || null,
    formData: raw.formData,
    Branch: raw.Branch,
  };
}

export async function sendStationRequestToProviders(
  requestId: number | string,
  body: { providerOrganizationIds: number[] }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `station/requests/${requestId}/send-to-providers`,
    body
  );
  return response.data;
}

/** POST /api/station/requests/:id/select-quote — Body: { "providerQuoteId": <id> } (per work-order-flow doc). هنا يُنشأ Job Order. */
export async function selectStationRequestQuote(
  requestId: number | string,
  body: { providerQuoteId: number }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `station/requests/${requestId}/select-quote`,
    body
  );
  return response.data;
}

export async function rejectStationRequestQuote(
  requestId: number | string,
  body: { quoteId: number; reason: string }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `station/requests/${requestId}/reject-quote`,
    body
  );
  return response.data;
}

/** API returns data: [{ id, serviceProviderOrganizationId, status, ServiceProviderOrganization: { id, name, type, status } }] */
export async function fetchLinkedProviders(): Promise<LinkedProviderItem[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: Array<{
      id: number;
      serviceProviderOrganizationId?: number;
      status?: string;
      ServiceProviderOrganization?: { id: number; name?: string; type?: string; status?: string };
    }>;
  }>("station/linked-providers");
  const data = response.data?.data;
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id,
    organizationId: item.serviceProviderOrganizationId ?? item.ServiceProviderOrganization?.id ?? item.id,
    organizationName: item.ServiceProviderOrganization?.name,
    status: item.status,
  }));
}

/** GET /api/requests/linked-providers — for "Send to providers" when creating external request (maintenance-request-frontend-guide) */
export async function fetchLinkedProvidersForRequest(): Promise<LinkedProviderForRequest[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: LinkedProviderForRequest[];
  }>("requests/linked-providers");
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

/** POST /api/requests — create service/maintenance request (maintenance-request-frontend-guide) */
export async function createRequest(
  payload: CreateRequestPayload
): Promise<CreateRequestResponse["data"]> {
  const response = await axiosInstance.post<CreateRequestResponse>("requests", payload);
  if (!response.data?.success && response.data?.data == null) {
    throw new Error(response.data?.message ?? "Failed to create request.");
  }
  return response.data.data;
}

/** API returns { data: { items: [{ id, name, type, status }], total, page, limit } } */
export async function fetchAvailableProviders(): Promise<LinkedProviderItem[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: LinkedProviderItem[] | { items?: Array<{ id: number; name?: string; type?: string; status?: string }>; total?: number; page?: number; limit?: number };
  }>("station/linked-providers/available");
  const raw = response.data?.data;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as LinkedProviderItem[];
  const items = raw.items ?? [];
  return items.map((item) => ({
    id: item.id,
    organizationId: item.id,
    organizationName: item.name ?? undefined,
    status: item.status,
  }));
}

/** POST /api/station/linked-providers — link a service provider to the station. Backend expects serviceProviderOrganizationId. */
export async function addLinkedProvider(body: {
  providerOrganizationId: number;
}): Promise<LinkedProviderItem> {
  const response = await axiosInstance.post<{
    success?: boolean;
    data?: LinkedProviderItem;
    message?: string;
  }>("station/linked-providers", {
    serviceProviderOrganizationId: body.providerOrganizationId,
  });
  const data = response.data?.data;
  if (!data) throw new Error(response.data?.message ?? "Failed to add linked provider.");
  return data;
}

/** DELETE /api/station/linked-providers/:id — remove linked provider (id = link id) */
export async function removeLinkedProvider(linkId: number | string): Promise<void> {
  await axiosInstance.delete(`station/linked-providers/${linkId}`);
}

/** GET /api/station/linked-providers/:id/profile — get linked provider profile */
export async function getLinkedProviderProfile(
  linkId: number | string
): Promise<Record<string, unknown>> {
  const response = await axiosInstance.get<{ success?: boolean; data?: Record<string, unknown> }>(
    `station/linked-providers/${linkId}/profile`
  );
  return response.data?.data ?? {};
}

export async function confirmJobOrderPaymentSent(
  jobOrderId: number | string,
  body?: ConfirmSentBody
): Promise<unknown> {
  const response = await axiosInstance.post(
    `station/job-orders/${jobOrderId}/confirm-sent`,
    body ?? {}
  );
  return response.data;
}

export async function uploadJobOrderReceipt(
  jobOrderId: number | string,
  file: File
): Promise<{ receiptFileUrl?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<{ success?: boolean; data?: { receiptFileUrl?: string } }>(
    `station/job-orders/${jobOrderId}/upload-receipt`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data?.data ?? {};
}

/** GET /api/station/job-orders — list job orders for the station */
export async function fetchStationJobOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: StationJobOrderListItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<StationJobOrderListResponse>("station/job-orders", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: StationJobOrderListItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

/** GET /api/station/job-orders/:id — job order detail for station */
export async function fetchStationJobOrderById(
  id: number | string
): Promise<StationJobOrderListItem | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: StationJobOrderListItem }>(
    `station/job-orders/${id}`
  );
  return response.data?.data ?? null;
}

/** POST /api/station/job-orders/:id/approve — approve close */
export async function approveStationJobOrder(jobOrderId: number | string): Promise<unknown> {
  const response = await axiosInstance.post(`station/job-orders/${jobOrderId}/approve`);
  return response.data;
}

/** POST /api/station/job-orders/:id/reject — rework */
export async function rejectStationJobOrder(
  jobOrderId: number | string,
  body: { reason?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(`station/job-orders/${jobOrderId}/reject`, body);
  return response.data;
}

/** GET /api/station/job-orders/:id/reports — maintenance reports */
export async function fetchStationJobOrderReports(
  jobOrderId: number | string
): Promise<import("@/types/station").StationJobOrderReportItem[]> {
  const response = await axiosInstance.get<{
    success?: boolean;
    data?: import("@/types/station").StationJobOrderReportItem[];
  }>(`station/job-orders/${jobOrderId}/reports`);
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
}

/** POST /api/reports/:id/approve — approve report */
export async function approveReport(reportId: number | string): Promise<unknown> {
  const response = await axiosInstance.post(`reports/${reportId}/approve`);
  return response.data;
}

/** POST /api/reports/:id/reject — reject report */
export async function rejectReport(
  reportId: number | string,
  body?: { reason?: string }
): Promise<unknown> {
  const response = await axiosInstance.post(`reports/${reportId}/reject`, body ?? {});
  return response.data;
}
