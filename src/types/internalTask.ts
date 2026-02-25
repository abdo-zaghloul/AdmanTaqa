export type InternalTaskStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PAUSED"
  | "WAITING_PARTS"
  | "COMPLETED"
  | "CLOSED";

export interface InternalTaskAttachment {
  id: number | string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt?: string;
}

export interface InternalTaskItem {
  id: number | string;
  workOrderId: number | string;
  title?: string | null;
  description?: string | null;
  assignedUserId?: number | null;
  status: InternalTaskStatus;
  reviewDecision?: "APPROVED" | "REJECTED" | null;
  note?: string | null;
  attachments?: InternalTaskAttachment[];
  createdAt: string;
  updatedAt?: string;
}

export interface InternalTasksListData {
  items: InternalTaskItem[];
  total: number;
  page: number;
  limit: number;
}

export interface InternalTasksQuery {
  workOrderId?: number | string;
  status?: InternalTaskStatus | "all";
  page?: number;
  limit?: number;
}

export interface CreateInternalTaskBody {
  workOrderId: number | string;
  title?: string;
  description?: string;
  assignedUserId?: number;
}

export interface UpdateInternalTaskStatusBody {
  status: InternalTaskStatus;
  note?: string;
}

export interface ReviewInternalTaskBody {
  decision: "APPROVE" | "REJECT";
  note?: string;
}

export interface InternalTasksApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}
