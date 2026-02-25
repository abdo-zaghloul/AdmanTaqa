import axiosInstance from "@/api/config";
import type {
  CreateWorkOrderBody,
  ReviewWorkOrderBody,
  UpdateWorkOrderBody,
  WorkOrderItem,
  WorkOrderPriority,
  WorkOrdersApiResponse,
  WorkOrdersListData,
  WorkOrdersQuery,
  WorkOrderStatus,
} from "@/types/workOrder";

const toObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const toNumberOrNull = (value: unknown): number | null =>
  typeof value === "number" ? value : null;

const toStringOrNull = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const toPriority = (value: unknown): WorkOrderPriority => {
  if (value === "LOW" || value === "MEDIUM" || value === "HIGH") return value;
  return "MEDIUM";
};

const toStatus = (value: unknown): WorkOrderStatus => {
  if (
    value === "PENDING" ||
    value === "IN_PROGRESS" ||
    value === "UNDER_REVIEW" ||
    value === "CLOSED"
  ) {
    return value;
  }
  return "PENDING";
};

const normalizeWorkOrder = (raw: unknown): WorkOrderItem | null => {
  const obj = toObject(raw);
  if (!obj || (typeof obj.id !== "number" && typeof obj.id !== "string")) return null;
  return {
    id: obj.id,
    title: typeof obj.title === "string" ? obj.title : "Untitled Work Order",
    branchId: toNumberOrNull(obj.branchId),
    assetId: toNumberOrNull(obj.assetId),
    description: toStringOrNull(obj.description),
    priority: toPriority(obj.priority),
    status: toStatus(obj.status),
    assignedUserId: toNumberOrNull(obj.assignedUserId),
    requestedByUserId: toNumberOrNull(obj.requestedByUserId),
    note: toStringOrNull(obj.note),
    createdAt:
      typeof obj.createdAt === "string" ? obj.createdAt : new Date().toISOString(),
    updatedAt: toStringOrNull(obj.updatedAt) ?? undefined,
  };
};

const normalizeWorkOrdersList = (
  payload: unknown,
  page = 1,
  limit = 20
): WorkOrdersListData => {
  const root = toObject(payload);
  const data = toObject(root?.data) ?? root;
  const itemsRaw = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];

  const items = itemsRaw
    .map(normalizeWorkOrder)
    .filter((row): row is WorkOrderItem => row !== null);

  return {
    items,
    total: typeof data?.total === "number" ? data.total : items.length,
    page: typeof data?.page === "number" ? data.page : page,
    limit: typeof data?.limit === "number" ? data.limit : limit,
  };
};

const getErrorMessage = (err: unknown, fallback: string) => {
  const withResponse = err as { response?: { data?: { message?: string } } };
  return typeof withResponse.response?.data?.message === "string"
    ? withResponse.response.data.message
    : err instanceof Error
    ? err.message
    : fallback;
};

export async function fetchWorkOrders(query: WorkOrdersQuery): Promise<WorkOrdersListData> {
  try {
    const params: Record<string, string | number> = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };
    if (query.status && query.status !== "all") params.status = query.status;
    if (query.priority && query.priority !== "all") params.priority = query.priority;
    if (query.branchId != null) params.branchId = query.branchId;
    if (query.assetId != null) params.assetId = query.assetId;

    const response = await axiosInstance.get<WorkOrdersApiResponse>("work-orders", { params });
    return normalizeWorkOrdersList(response.data, query.page, query.limit);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch work orders."));
  }
}

export async function fetchWorkOrderById(id: number | string): Promise<WorkOrderItem> {
  try {
    const response = await axiosInstance.get<WorkOrdersApiResponse>(`work-orders/${id}`);
    const item = normalizeWorkOrder(response.data?.data ?? response.data);
    if (!item) throw new Error("Work order not found.");
    return item;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch work order details."));
  }
}

export async function createWorkOrder(body: CreateWorkOrderBody): Promise<WorkOrderItem> {
  try {
    const response = await axiosInstance.post<WorkOrdersApiResponse>("work-orders", body);
    const item = normalizeWorkOrder(response.data?.data ?? response.data);
    if (!item) throw new Error("Unexpected create work order response.");
    return item;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to create work order."));
  }
}

export async function updateWorkOrder(
  id: number | string,
  body: UpdateWorkOrderBody
): Promise<WorkOrderItem> {
  try {
    const response = await axiosInstance.patch<WorkOrdersApiResponse>(`work-orders/${id}`, body);
    const item = normalizeWorkOrder(response.data?.data ?? response.data);
    if (!item) throw new Error("Unexpected update work order response.");
    return item;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update work order."));
  }
}

export async function reviewWorkOrder(
  id: number | string,
  body: ReviewWorkOrderBody
): Promise<WorkOrderItem> {
  try {
    const response = await axiosInstance.patch<WorkOrdersApiResponse>(
      `work-orders/${id}/review`,
      body
    );
    const item = normalizeWorkOrder(response.data?.data ?? response.data);
    if (!item) throw new Error("Unexpected review work order response.");
    return item;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to review work order."));
  }
}

export async function closeWorkOrder(
  id: number | string,
  note?: string
): Promise<WorkOrderItem> {
  try {
    const response = await axiosInstance.patch<WorkOrdersApiResponse>(
      `work-orders/${id}/close`,
      note ? { note } : undefined
    );
    const item = normalizeWorkOrder(response.data?.data ?? response.data);
    if (!item) throw new Error("Unexpected close work order response.");
    return item;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to close work order."));
  }
}

export async function fetchWorkOrderReviewQueue(
  page = 1,
  limit = 20
): Promise<WorkOrdersListData> {
  try {
    const response = await axiosInstance.get<WorkOrdersApiResponse>("work-orders/review-queue", {
      params: { page, limit },
    });
    return normalizeWorkOrdersList(response.data, page, limit);
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch work order review queue."));
  }
}
