export interface QuotationPricing {
  id?: number;
  quotationId?: number;
  amount?: number | string;
  currency?: string;
}

export interface QuotationItem {
  id: number;
  serviceRequestId: number;
  serviceProviderOrganizationId?: number | null;
  submittedByUserId?: number | null;
  status: string;
  createdAt: string;
  updatedAt?: string;
  QuotationPricing?: QuotationPricing | null;
}

export interface QuotationsListData {
  items: QuotationItem[];
  total: number;
  page: number;
  limit: number;
}

export interface QuotationsListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface SubmitQuotationBody {
  serviceRequestId: number;
  amount?: number;
  currency?: string;
}
