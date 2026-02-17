export interface User {
    id: number;
    email: string;
    fullName: string;
    organizationId: number;
}

export interface Organization {
    id: number;
    name: string;
    type: "FUEL_STATION" | "SERVICE_PROVIDER" | "AUTHORITY";
    status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface AuthData {
    user: User;
    organization: Organization;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface AuthResponse {
    success: boolean;
    data: AuthData;
    message?: string;
}
