export type WorkOrderStatus = "PENDING" | "IN_PROGRESS" | "UNDER_REVIEW" | "CLOSED";

export type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH";

export interface WorkOrderItem {
  id: number | string;
  title: string;
  branchId?: number | null;
  assetId?: number | null;
  description?: string | null;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedUserId?: number | null;
  requestedByUserId?: number | null;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkOrdersListData {
  items: WorkOrderItem[];
  total: number;
  page: number;
  limit: number;
}

export interface WorkOrdersQuery {
  status?: WorkOrderStatus | "all";
  branchId?: number;
  assetId?: number;
  priority?: WorkOrderPriority | "all";
  page?: number;
  limit?: number;
}

export interface CreateWorkOrderBody {
  title: string;
  branchId?: number;
  assetId?: number;
  description?: string;
  priority?: WorkOrderPriority;
  assignedUserId?: number;
}

export interface UpdateWorkOrderBody {
  title?: string;
  branchId?: number;
  assetId?: number;
  description?: string;
  priority?: WorkOrderPriority;
  assignedUserId?: number;
}

export interface ReviewWorkOrderBody {
  action: "APPROVE" | "REJECT";
  note?: string;
}

export interface WorkOrdersApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}
