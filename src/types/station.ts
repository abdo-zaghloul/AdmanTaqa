/** Station (Fuel Station) — maintenance requests, external requests, linked providers */

export type MaintenanceMode = "INTERNAL" | "EXTERNAL";
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH";

export interface FirstTaskInput {
  assignedUserId?: number | null;
  notes?: string | null;
}

export interface MaintenanceRequestBody {
  branchId: number;
  assetId?: number | null;
  title: string;
  description?: string | null;
  priority?: MaintenancePriority;
  maintenanceMode: MaintenanceMode;
  attachments?: unknown[];
  firstTask?: FirstTaskInput | null;
  providerOrganizationIds?: number[];
}

export interface InternalWorkOrderRef {
  id: number;
  title?: string;
  status?: string;
}

export interface InternalTaskRef {
  id: number;
  title?: string;
}

export interface ExternalRequestRef {
  id: number;
  status?: string;
}

export interface CreateMaintenanceRequestResponse {
  success?: boolean;
  data?: {
    internalWorkOrder?: InternalWorkOrderRef;
    firstTask?: InternalTaskRef;
    externalRequest?: ExternalRequestRef;
  };
  message?: string;
}

export interface StationRequestItem {
  id: number;
  status?: string;
  title?: string;
  description?: string | null;
  branchId?: number | null;
  maintenanceRequestId?: number;
  createdAt?: string;
  updatedAt?: string;
  quotes?: ProviderQuoteSummary[];
  selectedQuoteId?: number | null;
  cancellationReason?: string | null;
}

export interface ProviderQuoteSummary {
  id: number;
  providerOrganizationId?: number;
  amount?: number;
  status?: string;
  validUntil?: string;
}

export interface StationRequestDetail extends StationRequestItem {
  jobOrders?: ExternalJobOrderSummary[];
  paymentStatus?: string;
}

export interface ExternalJobOrderSummary {
  id: number;
  status?: string;
  paymentRecord?: { status?: string; rejectionReason?: string | null };
}

export interface StationRequestsListResponse {
  success?: boolean;
  data?: StationRequestItem[] | { items?: StationRequestItem[]; total?: number; page?: number; limit?: number };
  message?: string;
}

export interface LinkedProviderItem {
  id: number;
  organizationId: number;
  organizationName?: string;
  status?: string;
}

export interface ConfirmSentBody {
  referenceNumber?: string;
  receiptFileUrl?: string;
  amount?: number;
  method?: string;
}
