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
  "organizations/:id": {
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
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "users/:id": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "users/:id/edit": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  roles: {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "roles/create": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "roles/:id": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "roles/:id/edit": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  branches: {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "branches/create": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "branches/:id": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "branches/:id/edit": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  locations: {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
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
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION", "AUTHORITY"],
    anyPermissions: ["job-orders:read"],
  },
  "job-orders/:id": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION", "AUTHORITY"],
    anyPermissions: ["job-orders:read"],
  },
  "work-orders": {
    orgTypes: ["FUEL_STATION"],
    anyPermissions: ["workorders.read"],
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
    orgTypes: ["FUEL_STATION", "SERVICE_PROVIDER"],
  },
  "branch-requests/create": {
    orgTypes: ["FUEL_STATION"],
  },
  "branch-requests/:id": {
    orgTypes: ["FUEL_STATION", "SERVICE_PROVIDER", "AUTHORITY"],
  },
  "fuel-retail": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "fuel-retail/:id": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "fuel-retail/register": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
  },
  "fuel-retail/:id/edit": {
    orgTypes: ["SERVICE_PROVIDER", "FUEL_STATION"],
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
