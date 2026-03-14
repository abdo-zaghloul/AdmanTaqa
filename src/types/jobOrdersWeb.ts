/**
 * Job Orders Web API — ExternalJobOrder list for Service Provider (full includes).
 * Base: /api/job-orders-web
 */

export type JobOrdersWebStatus =
  | "CREATED"
  | "AWAITING_PAYMENT"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "UNDER_REVIEW"
  | "REWORK_REQUIRED"
  | "COMPLETED"
  | "CANCELLED"
  | "CLOSED"
  | "SUSPENDED";

export interface JobOrdersWebListParams {
  page?: number;
  limit?: number;
  /** Single status or comma-separated, e.g. "ACTIVE,IN_PROGRESS" */
  status?: string;
}

export interface JobOrdersWebListData {
  items: unknown[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface JobOrdersWebListResponse {
  success?: boolean;
  data?: JobOrdersWebListData;
  message?: string;
}
