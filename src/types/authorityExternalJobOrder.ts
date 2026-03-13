/** Authority view of external job orders — no financial data. */

export interface AuthorityExternalRequestBranch {
  id: number;
  nameEn?: string | null;
  nameAr?: string | null;
  address?: string | null;
  street?: string | null;
  organizationId?: number;
}

export interface AuthorityExternalRequestOrganization {
  id: number;
  name?: string | null;
  type?: string;
  status?: string;
}

export interface AuthorityExternalRequest {
  id: number;
  status?: string;
  branchId?: number | null;
  fuelStationOrganizationId?: number | null;
  serviceCategoryId?: number | null;
  formData?: { title?: string; description?: string; priority?: string; [key: string]: unknown };
  Branch?: AuthorityExternalRequestBranch | null;
  Organization?: AuthorityExternalRequestOrganization | null;
}

export interface AuthorityProviderQuoteRef {
  id: number;
  externalRequestId?: number;
  serviceProviderOrganizationId?: number;
  status?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorityExternalJobOrderItem {
  id: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  ExternalRequest?: AuthorityExternalRequest | null;
  ProviderQuote?: AuthorityProviderQuoteRef | null;
}

export interface AuthorityExternalJobOrderListData {
  items: AuthorityExternalJobOrderItem[];
  total: number;
  page?: number;
  limit?: number;
}

export interface AuthorityExternalJobOrderListResponse {
  success?: boolean;
  data?: AuthorityExternalJobOrderListData;
  message?: string;
}

export interface AuthorityExternalJobOrderDetail extends AuthorityExternalJobOrderItem {
  ExternalJobAssignments?: unknown[];
  ExternalJobVisits?: unknown[];
  MaintenanceReports?: unknown[];
  Branch?: AuthorityExternalRequestBranch | null;
}

export interface AuthorityExternalJobOrderDetailResponse {
  success?: boolean;
  data?: AuthorityExternalJobOrderDetail;
  message?: string;
}

export type DatePreset = "today" | "week" | "month" | "custom";

export interface AuthorityExternalJobOrdersListParams {
  page?: number;
  limit?: number;
  status?: string;
  fromDate?: string;
  toDate?: string;
  datePreset?: DatePreset;
  branchId?: number | string;
  fuelStationOrganizationId?: number | string;
  /** بحث باسم منظمة المحطة — تطابق جزئي (doc: fuelStationOrganizationName) */
  fuelStationOrganizationName?: string;
  /** بحث باسم منظمة مزود الخدمة — تطابق جزئي (doc: serviceProviderOrganizationName) */
  serviceProviderOrganizationName?: string;
  providerOrganizationId?: number | string;
  serviceCategoryId?: number | string;
}

export interface AuthorityExternalJobOrdersExportParams
  extends Omit<AuthorityExternalJobOrdersListParams, "page" | "limit"> {
  format?: "csv";
}
