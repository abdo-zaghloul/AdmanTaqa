import type { ServiceCategory } from "@/types/serviceCategory";

const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData;
    const maybeItems = (value as { items?: unknown }).items;
    if (Array.isArray(maybeItems)) return maybeItems;
  }
  return [];
};

export const normalizeServiceCategory = (input: unknown): ServiceCategory | null => {
  if (!input || typeof input !== "object") return null;
  const row = input as Record<string, unknown>;
  const id = row.id;
  if (typeof id !== "number") return null;

  return {
    id,
    name: typeof row.name === "string" ? row.name : undefined,
    nameEn: typeof row.nameEn === "string" ? row.nameEn : undefined,
    nameAr: typeof row.nameAr === "string" ? row.nameAr : undefined,
    code:
      typeof row.code === "string" || row.code === null
        ? (row.code as string | null)
        : undefined,
    status: typeof row.status === "string" ? (row.status as ServiceCategory["status"]) : undefined,
    proposedByOrganizationId:
      typeof row.proposedByOrganizationId === "number"
        ? row.proposedByOrganizationId
        : null,
    rejectedAt: typeof row.rejectedAt === "string" || row.rejectedAt === null
      ? (row.rejectedAt as string | null)
      : null,
    rejectedReason:
      typeof row.rejectedReason === "string" || row.rejectedReason === null
        ? (row.rejectedReason as string | null)
        : null,
    createdAt: typeof row.createdAt === "string" ? row.createdAt : undefined,
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : undefined,
  };
};

export const normalizeServiceCategoriesList = (input: unknown): ServiceCategory[] =>
  toArray(input)
    .map(normalizeServiceCategory)
    .filter((item): item is ServiceCategory => item !== null);
