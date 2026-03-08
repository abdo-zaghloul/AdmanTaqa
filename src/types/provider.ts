/** Provider (Service Provider) — RFQs, quotes, job orders, confirm received */

/** formData from GET /requests (RFQ) — doc: title, description, requiredTimeline */
export interface ProviderRfqFormData {
  title?: string;
  priority?: string;
  description?: string;
  requiredTimeline?: string;
  attachments?: unknown[];
}

export interface ProviderRfqBranch {
  id: number;
  nameEn?: string;
  nameAr?: string;
  street?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
}

export interface ProviderRfqOrganization {
  id: number;
  name?: string;
}

export interface ProviderRfqArea {
  id: number;
  name?: string;
}

export interface ProviderRfqItem {
  id: number;
  externalRequestId?: number;
  title?: string;
  description?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  quotes?: ProviderQuoteItem[];
  /** API list response fields */
  fuelStationOrganizationId?: number;
  branchId?: number | null;
  requestedByUserId?: number | null;
  areaId?: number | null;
  cityId?: number | null;
  assetId?: number | null;
  formData?: ProviderRfqFormData;
  Branch?: ProviderRfqBranch | null;
  Asset?: unknown;
  Organization?: ProviderRfqOrganization | null;
  Area?: ProviderRfqArea | null;
  City?: { id: number; name?: string } | null;
}

/** Backend returns this inside ProviderQuotes[].ExternalJobOrder (selected quote) */
export interface ProviderRfqExternalJobOrder {
  id: number;
  status?: string;
  /** API returns PaymentRecord (capital P) */
  PaymentRecord?: { status?: string; rejectionReason?: string | null };
}

/** Detail API may return ProviderQuotes (capital P) */
export interface ProviderRfqDetail extends ProviderRfqItem {
  stationOrganizationId?: number;
  ProviderQuotes?: ProviderQuoteItem[];
}

export interface ProviderQuoteItem {
  id: number;
  rfqId?: number;
  externalRequestId?: number;
  providerOrganizationId?: number;
  serviceProviderOrganizationId?: number;
  amount?: number;
  validUntil?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  /** When this quote is SELECTED, backend returns the linked External Job Order */
  ExternalJobOrder?: ProviderRfqExternalJobOrder;
}

/** Backend expects pricingJson (free-form) and submit. Use pricingJson for all quote details. */
export interface CreateQuoteBody {
  pricingJson?: Record<string, unknown>;
  submit?: boolean;
  /** @deprecated Prefer pricingJson.amount */
  amount?: number;
  validUntil?: string;
  [key: string]: unknown;
}

/** ExternalRequest nested in provider job order list (from API) */
export interface ProviderJobOrderExternalRequest {
  id?: number;
  status?: string;
  branchId?: number | null;
  formData?: {
    title?: string;
    priority?: string;
    description?: string;
    attachments?: unknown[];
    [key: string]: unknown;
  };
}

export interface ProviderJobOrderItem {
  id: number;
  providerQuoteId?: number;
  externalRequestId?: number;
  assignedBranchId?: number | null;
  status?: string;
  activatedAt?: string | null;
  expectedStartDate?: string | null;
  expectedEndDate?: string | null;
  cancellationReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  paymentRecord?: PaymentRecordSummary;
  /** Nested from API (ExternalRequest) — request details + formData */
  externalRequest?: ProviderJobOrderExternalRequest | null;
  providerQuote?: { id?: number; status?: string; [key: string]: unknown } | null;
}

export interface PaymentRecordSummary {
  id?: number;
  status?: string;
  rejectionReason?: string | null;
  /** URL of uploaded bank transfer receipt (when API returns it). */
  receiptFileUrl?: string | null;
}

export interface ProviderJobOrderDetail extends ProviderJobOrderItem {
  title?: string;
  description?: string | null;
  selectedQuoteId?: number;
  /** When status is CANCELLED */
  cancellationReason?: string | null;
}

export interface ConfirmReceivedBody {
  confirm: boolean;
  note?: string;
  rejectionReason?: string;
}

export interface ProviderRfqsListResponse {
  success?: boolean;
  data?: ProviderRfqItem[] | { items?: ProviderRfqItem[]; total?: number; page?: number; limit?: number };
  message?: string;
}

export interface ProviderJobOrdersListResponse {
  success?: boolean;
  data?:
    | ProviderJobOrderItem[]
    | { items?: ProviderJobOrderItem[]; total?: number; page?: number; limit?: number };
  message?: string;
}

export interface ProviderVisitItem {
  id: number;
  visitDate?: string;
  status?: string;
  notes?: string | null;
  createdAt?: string;
  /** Visit type when supported by API */
  type?: "EXECUTION" | "INSPECTION" | "FOLLOW_UP";
}

/** Body for POST .../job-orders/:id/visits — create visit (visit-first flow). */
export type ProviderVisitType = "EXECUTION" | "INSPECTION" | "FOLLOW_UP";

export interface CreateProviderVisitBody {
  type: ProviderVisitType;
  scheduledAt?: string; // YYYY-MM-DD
  operatorUserId?: number;
  notes?: string;
}

/** Body for POST .../visits/checkin — arrivalVerificationType required by backend */
export type ProviderVisitCheckinVerificationType = "GPS" | "QR" | "MANUAL";

export interface CreateProviderVisitCheckinBody {
  arrivalVerificationType: ProviderVisitCheckinVerificationType;
  notes?: string;
  visitDate?: string; // YYYY-MM-DD
  metadataJson?: object;
}

export interface ProviderAttachmentItem {
  id: number;
  name?: string;
  url?: string;
  createdAt?: string;
}

/** Maintenance report (provider job order) */
export interface ProviderReportItem {
  id: number;
  jobOrderId?: number;
  title?: string;
  content?: string | null;
  status?: string;
  submittedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProviderReportBody {
  title: string;
  content?: string | null;
  [key: string]: unknown;
}
