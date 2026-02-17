export interface OrganizationProfile {
    id: number;
    name: string;
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
