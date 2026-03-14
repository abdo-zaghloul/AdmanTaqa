/** Quotations-web API — ProviderQuote for external RFQs (Service Provider only). */

export type QuotationsWebStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVISED"
  | "WITHDRAWN"
  | "REJECTED"
  | "SELECTED";

export interface QuotationsWebAttachment {
  id?: number;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string;
  fileSize?: number;
  createdAt?: string;
}

export interface QuotationsWebListParams {
  page?: number;
  limit?: number;
  /** Filter by status; empty string means "all" (omit from query). */
  status?: QuotationsWebStatus | "";
}

export interface QuotationsWebExternalRequestRef {
  id?: number;
  status?: string;
  formData?: Record<string, unknown>;
  Branch?: { id?: number; nameEn?: string; nameAr?: string };
  Organization?: { id?: number; name?: string };
}

/** List item from GET /quotations-web */
export interface QuotationsWebListItem {
  id: number;
  status?: string;
  version?: number;
  externalRequestId?: number;
  createdAt?: string;
  updatedAt?: string;
  paymentType?: string;
  hasAttachments?: boolean;
  attachments?: QuotationsWebAttachment[];
  ExternalRequest?: QuotationsWebExternalRequestRef | null;
}

export interface QuotationsWebListData {
  items: QuotationsWebListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface QuotationsWebListResponse {
  success?: boolean;
  data?: QuotationsWebListData;
  message?: string;
}

/** Extended ExternalRequest for detail — includes Asset, Area, City */
export interface QuotationsWebExternalRequestDetail extends QuotationsWebExternalRequestRef {
  address?: string;
  latitude?: string;
  longitude?: string;
  Asset?: { id?: number; name?: string; maintenanceType?: string; description?: string } | null;
  Area?: { id?: number; name?: string } | null;
  City?: { id?: number; name?: string } | null;
}

export interface QuotePaymentTerm {
  sequence?: number;
  percent?: number;
  trigger?: string;
  note?: string | null;
}

export interface ProviderQuoteRevision {
  id?: number;
  version?: number;
  pricingJson?: Record<string, unknown>;
  submittedAt?: string;
}

/** Detail from GET /quotations-web/:id */
export interface QuotationsWebDetail {
  id: number;
  status?: string;
  version?: number;
  externalRequestId?: number;
  serviceProviderOrganizationId?: number;
  submittedByUserId?: number;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  paymentType?: string;
  hasAttachments?: boolean;
  attachments?: QuotationsWebAttachment[];
  QuoteAttachments?: unknown[];
  QuotePaymentTerms?: QuotePaymentTerm[];
  ProviderQuoteRevisions?: ProviderQuoteRevision[];
  ExternalRequest?: QuotationsWebExternalRequestDetail | null;
}

export interface QuotationsWebDetailResponse {
  success?: boolean;
  data?: QuotationsWebDetail;
  message?: string;
}
