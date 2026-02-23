export interface PermissionItem {
  id: number;
  code: string;
  name?: string;
  description?: string;
}

export interface RoleItem {
  id: number | string;
  name: string;
  description?: string | null;
  type?: string;
  isSystem?: boolean;
  organizationId?: number | null;
  permissions: string[];
  permissionIds: number[];
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RolesListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface RoleResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface PermissionsListResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

export interface CreateRoleBody {
  name: string;
  description?: string;
  permissionIds?: number[];
}

export interface UpdateRoleBody {
  name?: string;
  description?: string;
  permissionIds?: number[];
}
