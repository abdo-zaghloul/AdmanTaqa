/** Provider (Service Provider) — RFQs, quotes, job orders, confirm received */

/** formData from GET provider/rfqs list item */
export interface ProviderRfqFormData {
  title?: string;
  priority?: string;
  description?: string;
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

/** Detail API may return ProviderQuotes (capital P) */
export interface ProviderRfqDetail extends ProviderRfqItem {
  stationOrganizationId?: number;
  ProviderQuotes?: ProviderQuoteItem[];
}

export interface ProviderQuoteItem {
  id: number;
  rfqId?: number;
  providerOrganizationId?: number;
  amount?: number;
  validUntil?: string;
  status?: string;
  createdAt?: string;
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

export interface ProviderJobOrderItem {
  id: number;
  externalRequestId?: number;
  status?: string;
  paymentRecord?: PaymentRecordSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecordSummary {
  id?: number;
  status?: string;
  rejectionReason?: string | null;
}

export interface ProviderJobOrderDetail extends ProviderJobOrderItem {
  title?: string;
  description?: string | null;
  selectedQuoteId?: number;
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
