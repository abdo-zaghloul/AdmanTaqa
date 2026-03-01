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

export async function selectStationRequestQuote(
  requestId: number | string,
  body: { quoteId: number }
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

export async function fetchLinkedProviders(): Promise<LinkedProviderItem[]> {
  const response = await axiosInstance.get<{ success?: boolean; data?: LinkedProviderItem[] }>(
    "station/linked-providers"
  );
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
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

export async function fetchAvailableProviders(): Promise<LinkedProviderItem[]> {
  const response = await axiosInstance.get<{ success?: boolean; data?: LinkedProviderItem[] }>(
    "station/linked-providers/available"
  );
  const data = response.data?.data;
  return Array.isArray(data) ? data : [];
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
