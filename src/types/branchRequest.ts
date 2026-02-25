export type BranchRequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface BranchRequestItem {
  id: number;
  organizationId?: number | null;
  branchId?: number | null;
  referenceCode?: string;
  nameEn?: string;
  nameAr?: string;
  areaId?: number | null;
  stationTypeId?: number | null;
  licenseNumber?: string | null;
  street?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workingHours?: Record<string, { open?: string; close?: string }>;
  address?: string | null;
  ownerName?: string | null;
  ownerEmail?: string | null;
  managerName?: string | null;
  managerEmail?: string | null;
  managerPhone?: string | null;
  createManagerAccount?: boolean;
  fuelTypeIds?: number[];
  status: BranchRequestStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface BranchRequestsListData {
  items: BranchRequestItem[];
  total: number;
  page: number;
  limit: number;
}

export interface BranchRequestsListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface BranchRequestResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface CreateBranchRequestBody {
  nameEn: string;
  nameAr: string;
  areaId: number;
  stationTypeId?: number;
  licenseNumber?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  workingHours?: Record<string, { open?: string; close?: string }>;
  address?: string;
  ownerName?: string;
  ownerEmail?: string;
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
  createManagerAccount?: boolean;
  fuelTypeIds?: number[];
}

export interface BranchRequestsQuery {
  status?: BranchRequestStatus | "all";
  page?: number;
  limit?: number;
}

export interface RejectBranchRequestBody {
  reason?: string;
}
