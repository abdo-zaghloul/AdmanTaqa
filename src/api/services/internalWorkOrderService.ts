import axiosInstance from "@/api/config";
import type {
  InternalWorkOrderItem,
  InternalWorkOrderListResponse,
  CreateInternalWorkOrderBody,
  UpdateInternalWorkOrderBody,
  ReviewInternalWorkOrderBody,
} from "@/types/internalWorkOrder";

function getErrorMessage(err: unknown, fallback: string): string {
  const withResponse = err as { response?: { data?: { message?: string } } };
  return typeof withResponse.response?.data?.message === "string"
    ? withResponse.response.data.message
    : err instanceof Error
      ? err.message
      : fallback;
}

function normalizeItem(raw: unknown): InternalWorkOrderItem | null {
  if (raw == null || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const id = obj.id;
  if (id == null || (typeof id !== "number" && typeof id !== "string")) return null;
  return {
    id: typeof id === "string" ? Number(id) : id,
    title: typeof obj.title === "string" ? obj.title : "Untitled",
    branchId: typeof obj.branchId === "number" ? obj.branchId : null,
    assetId: typeof obj.assetId === "number" ? obj.assetId : null,
    description: typeof obj.description === "string" ? obj.description : null,
    priority:
      obj.priority === "LOW" || obj.priority === "MEDIUM" || obj.priority === "HIGH"
        ? obj.priority
        : undefined,
    status:
      obj.status === "PENDING" ||
      obj.status === "IN_PROGRESS" ||
      obj.status === "UNDER_REVIEW" ||
      obj.status === "CLOSED"
        ? obj.status
        : "PENDING",
    createdAt: typeof obj.createdAt === "string" ? obj.createdAt : undefined,
    updatedAt: typeof obj.updatedAt === "string" ? obj.updatedAt : undefined,
    tasks: Array.isArray(obj.tasks) ? (obj.tasks as InternalWorkOrderItem["tasks"]) : undefined,
  };
}

export async function fetchInternalWorkOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: InternalWorkOrderItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<InternalWorkOrderListResponse>("internal/work-orders", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const rawItems = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? [];
  const items = rawItems
    .map(normalizeItem)
    .filter((r): r is InternalWorkOrderItem => r != null);
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

export async function fetchInternalWorkOrderReviewQueue(params?: {
  page?: number;
  limit?: number;
}): Promise<{ items: InternalWorkOrderItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<InternalWorkOrderListResponse>(
    "internal/work-orders/review-queue",
    { params: params ?? {} }
  );
  const data = res.data?.data;
  const rawItems = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items ?? [];
  const items = rawItems
    .map(normalizeItem)
    .filter((r): r is InternalWorkOrderItem => r != null);
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

export async function fetchInternalWorkOrderById(
  id: number | string
): Promise<InternalWorkOrderItem | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: unknown }>(
    `internal/work-orders/${id}`
  );
  const item = normalizeItem(response.data?.data ?? response.data);
  return item ?? null;
}

export async function createInternalWorkOrder(
  body: CreateInternalWorkOrderBody
): Promise<InternalWorkOrderItem> {
  const response = await axiosInstance.post<{ success?: boolean; data?: unknown }>(
    "internal/work-orders",
    body
  );
  const item = normalizeItem(response.data?.data ?? response.data);
  if (!item) {
    throw new Error(getErrorMessage(null, "Unexpected create internal work order response."));
  }
  return item;
}

export async function updateInternalWorkOrder(
  id: number | string,
  body: UpdateInternalWorkOrderBody
): Promise<InternalWorkOrderItem> {
  const response = await axiosInstance.patch<{ success?: boolean; data?: unknown }>(
    `internal/work-orders/${id}`,
    body
  );
  const item = normalizeItem(response.data?.data ?? response.data);
  if (!item) {
    throw new Error(getErrorMessage(null, "Unexpected update internal work order response."));
  }
  return item;
}

export async function reviewInternalWorkOrder(
  id: number | string,
  body: ReviewInternalWorkOrderBody
): Promise<InternalWorkOrderItem> {
  const response = await axiosInstance.patch<{ success?: boolean; data?: unknown }>(
    `internal/work-orders/${id}/review`,
    body
  );
  const item = normalizeItem(response.data?.data ?? response.data);
  if (!item) {
    throw new Error(getErrorMessage(null, "Unexpected review internal work order response."));
  }
  return item;
}

export async function closeInternalWorkOrder(id: number | string): Promise<InternalWorkOrderItem> {
  const response = await axiosInstance.patch<{ success?: boolean; data?: unknown }>(
    `internal/work-orders/${id}/close`
  );
  const item = normalizeItem(response.data?.data ?? response.data);
  if (!item) {
    throw new Error(getErrorMessage(null, "Unexpected close internal work order response."));
  }
  return item;
}
