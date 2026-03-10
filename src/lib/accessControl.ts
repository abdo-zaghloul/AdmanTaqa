import type { Organization } from "@/types/auth";

export type OrgType = Organization["type"];

export type AccessRule = {
  orgTypes?: OrgType[];
  anyPermissions?: string[];
  allPermissions?: string[];
};

// Route keys match router child paths without leading slash.
export const ROUTE_ACCESS_RULES: Record<string, AccessRule> = {
  organizations: {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "organizations/rejected": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "organizations/:id": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "fuel-stations": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "fuel-stations/pending": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "fuel-stations/rejected": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "fuel-stations/:id": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  registrations: {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "registrations/:id": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  onboarding: {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  "onboarding/:id": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["organizations:approve", "organizations:read"],
  },
  inspections: {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["inspections:read", "inspections:create"],
  },
  "audit-log": {
    orgTypes: ["AUTHORITY"],
    anyPermissions: ["audit:read"],
  },
  users: {
    orgTypes: ["AUTHORITY","SERVICE_PROVIDER", ],
  },
  "users/:id": {
    orgTypes: ["AUTHORITY" ,"SERVICE_PROVIDER", ],
  },
  "users/:id/edit": {
    orgTypes: ["AUTHORITY" ,"SERVICE_PROVIDER", ],
  },
  roles: {
    orgTypes: ["AUTHORITY" ,"SERVICE_PROVIDER", ],
  },
  "roles/create": {
    orgTypes: ["AUTHORITY" ,"SERVICE_PROVIDER", ],
  },
  "roles/:id": {
    orgTypes: ["AUTHORITY" ,"SERVICE_PROVIDER", ],
  },
  "roles/:id/edit": {
    orgTypes: [ "AUTHORITY" ,"SERVICE_PROVIDER",],
  },
  branches: {
    orgTypes: ["FUEL_STATION"],
  },
  "branches/create": {
    orgTypes: ["FUEL_STATION"],
  },
  "branches/:id": {
    orgTypes: ["FUEL_STATION"],
  },
  "branches/:id/edit": {
    orgTypes: ["FUEL_STATION"],
  },
  locations: {
    orgTypes: ["AUTHORITY",  "FUEL_STATION"],
  },
  "service-Offering": {
    orgTypes: ["SERVICE_PROVIDER", "AUTHORITY"],
  },
  "service-categories": {
    orgTypes: ["SERVICE_PROVIDER", "AUTHORITY"],
  },
  quotations: {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION", "AUTHORITY"],
    anyPermissions: ["quotations:read", "quotations:submit"],
  },
  "job-orders": {
    orgTypes: [  "AUTHORITY"],
    anyPermissions: ["job-orders:read"],
  },
  "job-orders/:id": {
    orgTypes: [  "AUTHORITY"],
    anyPermissions: ["job-orders:read"],
  },
  "work-orders/:id": {
    orgTypes: ["FUEL_STATION"],
    anyPermissions: ["workorders.read"],
  },
  "work-orders/review-queue": {
    orgTypes: ["FUEL_STATION"],
    anyPermissions: ["workorders.approve", "internal_tasks.review"],
  },
  "branch-requests": {
    orgTypes: ["FUEL_STATION"],
  },
  "branch-requests/create": {
    orgTypes: ["FUEL_STATION"],
  },
  "branch-requests/:id": {
    orgTypes: ["FUEL_STATION", "AUTHORITY"],
  },
  // Station (Fuel Station): internal work orders, external requests
  "internal-work-orders": {
    orgTypes: ["FUEL_STATION"],
  },
  "internal-work-orders/review-queue": {
    orgTypes: ["FUEL_STATION"],
  },
  "internal-work-orders/:id": {
    orgTypes: ["FUEL_STATION"],
  },
  "station-requests": {
    orgTypes: ["FUEL_STATION"],
  },
  "station-requests/create": {
    orgTypes: ["FUEL_STATION"],
  },
  "station-requests/:id": {
    orgTypes: ["FUEL_STATION"],
  },
  "linked-providers": {
    orgTypes: ["FUEL_STATION"],
  },
  "station-job-orders": {
    orgTypes: ["FUEL_STATION"],
  },
  "station-job-orders/:id": {
    orgTypes: ["FUEL_STATION"],
  },
  // Provider (Service Provider): RFQs, job orders
  "provider-rfqs": {
    orgTypes: ["SERVICE_PROVIDER"],
  },
  "provider-rfqs/:id": {
    orgTypes: ["SERVICE_PROVIDER"],
  },
  "provider-job-orders": {
    orgTypes: ["SERVICE_PROVIDER"],
  },
  "provider-job-orders/:id": {
    orgTypes: ["SERVICE_PROVIDER"],
  },
};

export const normalizePathKey = (path: string) => path.replace(/^\/+/, "");

export const canAccessByRule = (
  rule: AccessRule | undefined,
  organizationType: OrgType | undefined,
  permissions: string[]
) => {
  if (!rule) return true;
  if (rule.orgTypes?.length) {
    if (!organizationType || !rule.orgTypes.includes(organizationType)) return false;
  }

  // If permissions were loaded, enforce permission checks.
  // If backend returns no permissions for a session, fall back to org-type gating.
  if (permissions.length > 0 && rule.anyPermissions?.length) {
    const allowed = rule.anyPermissions.some((code) => permissions.includes(code));
    if (!allowed) return false;
  }
  if (permissions.length > 0 && rule.allPermissions?.length) {
    const allowed = rule.allPermissions.every((code) => permissions.includes(code));
    if (!allowed) return false;
  }
  return true;
};

