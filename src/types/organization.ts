import type { ServiceCategory } from "@/types/serviceCategory";

export interface OrganizationProfile {
    id: number;
    name: string;
    nameEn: string;
    nameAr: string;
    type: "FUEL_STATION" | "SERVICE_PROVIDER" | "AUTHORITY";
    status: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason: string | null;
    approvedAt: string | null;
    approvedByUserId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationResponse {
    success: boolean;
    data: OrganizationProfile;
    message?: string;
}

/** List organizations (Authority). GET /api/organizations?status=&type=&page=&limit= */
export interface OrganizationsListData {
    items: OrganizationProfile[];
    total: number;
    page: number;
    limit: number;
}

export interface OrganizationsListResponse {
    success: boolean;
    data: OrganizationsListData;
    message?: string;
}

/** Approve/Reject. POST /api/organizations/:id/approve */
export interface ApproveOrganizationBody {
    decision: "APPROVED" | "REJECTED";
    reason?: string;
}

export type OrganizationDocumentType = "LICENSE" | "REGISTRATION" | "OTHER";

export interface OrganizationDocument {
    id: number;
    organizationId: number;
    documentType: OrganizationDocumentType;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    createdAt?: string;
}

export interface OrganizationDocumentsResponse {
    success: boolean;
    data: OrganizationDocument[];
    message?: string;
}

export interface ApprovalHistoryItem {
    id?: number;
    decision: "APPROVED" | "REJECTED";
    reason?: string | null;
    approvedByUserId?: number | null;
    createdAt: string;
}

export interface OrganizationApprovalHistoryResponse {
    success: boolean;
    data: ApprovalHistoryItem[];
    message?: string;
}

export interface OrganizationServiceCategoriesResponse {
    success: boolean;
    data: ServiceCategory[];
    message?: string;
}

/** Service Offerings: /api/organizations/:id/service-offerings */
export interface ServiceOffering {
    id: number;
    organizationId: number;
    serviceCategoryId: number;
    cityId: number;
    governorateId: number;
    amount: number | string;
    currency: string;
    createdAt: string;
    updatedAt: string;
    ServiceCategory?: {
        id: number;
        nameEn?: string;
        nameAr?: string;
        code?: string;
    };
    City?: {
        id: number;
        name?: string;
        code?: string;
    };
    Governorate?: {
        id: number;
        name?: string;
        code?: string;
    };
}

export interface ServiceOfferingsListResponse {
    success: boolean;
    data: ServiceOffering[];
    message?: string;
}

export interface ServiceOfferingResponse {
    success: boolean;
    data: ServiceOffering;
    message?: string;
}

export interface ServiceOfferingsFilter {
    serviceCategoryId?: number;
    cityId?: number;
    governorateId?: number;
}

export interface CreateServiceOfferingBody {
    serviceCategoryId: number;
    cityId: number;
    governorateId: number;
    amount: number;
    currency?: string;
}

export interface UpdateServiceOfferingBody {
    amount?: number;
    currency?: string;
}

/** Service Provider Profile. GET/POST/PATCH/DELETE .../service-provider-profile */
export interface ServiceProviderProfile {
    id?: number;
    organizationId?: number;
    licenseNumber?: string | null;
    yearsExperience?: number | null;
    areaId?: number | null;
    cityId?: number | null;
    street?: string | null;
    serviceCategories?: string[] | null;
    Area?: { id: number; name: string; code?: string } | null;
    City?: { id: number; name: string; code?: string } | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServiceProviderProfileResponse {
    success: boolean;
    data: ServiceProviderProfile;
    message?: string;
}

export interface ServiceProviderProfileBody {
    licenseNumber?: string;
    yearsExperience?: number;
    areaId?: number;
    cityId?: number;
    street?: string;
    serviceCategories?: string[];
}

/** Profile documents: COMMERCIAL_REGISTRATION | TAX_CERTIFICATE | TECHNICAL_CERTIFICATE | INSURANCE_CERTIFICATE */
export type ServiceProviderProfileDocumentType =
    | "COMMERCIAL_REGISTRATION"
    | "TAX_CERTIFICATE"
    | "TECHNICAL_CERTIFICATE"
    | "INSURANCE_CERTIFICATE";

export interface ServiceProviderProfileDocument {
    id: number;
    documentType: ServiceProviderProfileDocumentType;
    url?: string;
    fileUrl?: string;
    fileName?: string;
    createdAt?: string;
}

export interface ServiceProviderProfileDocumentsResponse {
    success: boolean;
    data: ServiceProviderProfileDocument[];
    message?: string;
}
