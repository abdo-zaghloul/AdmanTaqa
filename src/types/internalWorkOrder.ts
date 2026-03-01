/** Internal Work Orders — GET/PATCH /api/internal/work-orders (Fuel Station only) */

export type InternalWorkOrderStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "CLOSED";

export type InternalWorkOrderPriority = "LOW" | "MEDIUM" | "HIGH";

export interface InternalWorkOrderItem {
  id: number;
  title: string;
  branchId?: number | null;
  assetId?: number | null;
  description?: string | null;
  priority?: InternalWorkOrderPriority;
  status: InternalWorkOrderStatus;
  createdAt?: string;
  updatedAt?: string;
  tasks?: InternalTaskRef[];
}

export interface InternalTaskRef {
  id: number;
  title?: string;
  status?: string;
  assignedUserId?: number | null;
}

export interface InternalWorkOrderListResponse {
  success?: boolean;
  data?:
    | InternalWorkOrderItem[]
    | { items?: InternalWorkOrderItem[]; total?: number; page?: number; limit?: number };
  message?: string;
}

export interface CreateInternalWorkOrderBody {
  title: string;
  branchId?: number;
  assetId?: number;
  description?: string;
  priority?: InternalWorkOrderPriority;
}

export interface UpdateInternalWorkOrderBody {
  title?: string;
  branchId?: number;
  assetId?: number;
  description?: string;
  priority?: InternalWorkOrderPriority;
}

export interface ReviewInternalWorkOrderBody {
  decision: "APPROVE" | "REJECT";
  reason?: string;
}
