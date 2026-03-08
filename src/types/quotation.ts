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
  /** From API: ServiceRequest with Branch, Organization, formData */
  ServiceRequest?: {
    id?: number;
    status?: string;
    branchId?: number;
    fuelStationOrganizationId?: number;
    formData?: { priority?: string; description?: string; [key: string]: unknown };
    Branch?: { id?: number; nameEn?: string; nameAr?: string };
    Organization?: { id?: number; name?: string };
  };
  /** Provider organization (service provider) */
  Organization?: { id?: number; name?: string };
  /** User who submitted the quotation */
  User?: { id?: number; fullName?: string; email?: string };
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
