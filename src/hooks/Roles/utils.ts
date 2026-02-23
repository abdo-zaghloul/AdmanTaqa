import type { PermissionItem, RoleItem } from "@/types/role";

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

const toPermissionCode = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;
  const rec = value as Record<string, unknown>;
  const candidate = rec.code ?? rec.name ?? rec.permission ?? rec.key;
  return typeof candidate === "string" ? candidate : null;
};

const toPermissionId = (value: unknown): number | null => {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "object") return null;
  const id = (value as { id?: unknown }).id;
  return typeof id === "number" ? id : null;
};

export const normalizePermissions = (input: unknown): PermissionItem[] => {
  const rawList = toArray(input);
  return rawList
    .map((raw) => {
      if (typeof raw === "string") {
        return { id: -1, code: raw, name: raw } as PermissionItem;
      }
      if (!raw || typeof raw !== "object") return null;
      const rec = raw as Record<string, unknown>;
      const id = typeof rec.id === "number" ? rec.id : -1;
      const code = toPermissionCode(raw);
      if (!code) return null;
      return {
        id,
        code,
        name: typeof rec.name === "string" ? rec.name : code,
        description:
          typeof rec.description === "string" ? rec.description : undefined,
      } as PermissionItem;
    })
    .filter((item): item is PermissionItem => item !== null);
};

export const normalizeRole = (raw: unknown): RoleItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const rawPermissions = Array.isArray(rec.permissions) ? rec.permissions : [];
  const rawPermissionIds = Array.isArray(rec.permissionIds)
    ? rec.permissionIds
    : [];

  const permissions = rawPermissions
    .map(toPermissionCode)
    .filter((item): item is string => !!item);

  const permissionIds = [
    ...rawPermissionIds
      .map((id) => (typeof id === "number" ? id : null))
      .filter((item): item is number => item !== null),
    ...rawPermissions
      .map(toPermissionId)
      .filter((item): item is number => item !== null),
  ];

  return {
    id:
      typeof rec.id === "number" || typeof rec.id === "string" ? rec.id : "",
    name: typeof rec.name === "string" ? rec.name : "Unnamed role",
    description: typeof rec.description === "string" ? rec.description : "",
    type: typeof rec.type === "string" ? rec.type : "ORGANIZATION",
    isSystem: typeof rec.isSystem === "boolean" ? rec.isSystem : undefined,
    organizationId:
      typeof rec.organizationId === "number" ? rec.organizationId : null,
    permissions,
    permissionIds: Array.from(new Set(permissionIds)),
    userCount: typeof rec.userCount === "number" ? rec.userCount : undefined,
    createdAt: typeof rec.createdAt === "string" ? rec.createdAt : undefined,
    updatedAt: typeof rec.updatedAt === "string" ? rec.updatedAt : undefined,
  };
};

export const normalizeRolesList = (input: unknown): RoleItem[] => {
  const rows = toArray(input);
  return rows
    .map(normalizeRole)
    .filter((row): row is RoleItem => row !== null && row.id !== "");
};
