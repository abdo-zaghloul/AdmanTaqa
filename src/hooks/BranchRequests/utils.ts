import type {
  BranchRequestItem,
  BranchRequestsListData,
  BranchRequestStatus,
} from "@/types/branchRequest";

const toObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const toNumberOrNull = (value: unknown): number | null =>
  typeof value === "number" ? value : null;

const toStringOrNull = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const toStatus = (value: unknown): BranchRequestStatus => {
  if (
    value === "PENDING" ||
    value === "UNDER_REVIEW" ||
    value === "APPROVED" ||
    value === "REJECTED"
  ) {
    return value;
  }
  return "PENDING";
};

export const normalizeBranchRequest = (raw: unknown): BranchRequestItem | null => {
  const obj = toObject(raw);
  if (!obj || typeof obj.id !== "number") return null;

  return {
    id: obj.id,
    organizationId: toNumberOrNull(obj.organizationId),
    branchId: toNumberOrNull(obj.branchId),
    referenceCode: toStringOrNull(obj.referenceCode) ?? undefined,
    nameEn: toStringOrNull(obj.nameEn) ?? undefined,
    nameAr: toStringOrNull(obj.nameAr) ?? undefined,
    areaId: toNumberOrNull(obj.areaId),
    stationTypeId: toNumberOrNull(obj.stationTypeId),
    licenseNumber: toStringOrNull(obj.licenseNumber),
    street: toStringOrNull(obj.street),
    latitude: toNumberOrNull(obj.latitude),
    longitude: toNumberOrNull(obj.longitude),
    workingHours:
      obj.workingHours && typeof obj.workingHours === "object"
        ? (obj.workingHours as Record<string, { open?: string; close?: string }>)
        : undefined,
    address: toStringOrNull(obj.address),
    ownerName: toStringOrNull(obj.ownerName),
    ownerEmail: toStringOrNull(obj.ownerEmail),
    managerName: toStringOrNull(obj.managerName),
    managerEmail: toStringOrNull(obj.managerEmail),
    managerPhone: toStringOrNull(obj.managerPhone),
    createManagerAccount:
      typeof obj.createManagerAccount === "boolean"
        ? obj.createManagerAccount
        : undefined,
    fuelTypeIds: Array.isArray(obj.fuelTypeIds)
      ? obj.fuelTypeIds.filter((v): v is number => typeof v === "number")
      : undefined,
    status: toStatus(obj.status),
    rejectionReason: toStringOrNull(obj.rejectionReason),
    createdAt:
      typeof obj.createdAt === "string" ? obj.createdAt : new Date().toISOString(),
    updatedAt: toStringOrNull(obj.updatedAt) ?? undefined,
  };
};

export const normalizeBranchRequestsList = (
  payload: unknown,
  page = 1,
  limit = 20
): BranchRequestsListData => {
  const root = toObject(payload);
  const data = toObject(root?.data) ?? root;
  const itemsRaw = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
    ? data
    : [];

  const items = itemsRaw
    .map(normalizeBranchRequest)
    .filter((row): row is BranchRequestItem => row !== null);

  return {
    items,
    total: typeof data?.total === "number" ? data.total : items.length,
    page: typeof data?.page === "number" ? data.page : page,
    limit: typeof data?.limit === "number" ? data.limit : limit,
  };
};
