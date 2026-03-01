/** Role as returned in user.roles[] */
export interface UserRoleRef {
  id: number;
  name: string;
}

/** User as returned from GET /api/users and GET /api/users/:id */
export interface ApiUser {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  organizationId: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** List of roles (API returns roles array) */
  roles?: UserRoleRef[];
  /** @deprecated Prefer roles[].name - kept for backward compatibility if API sometimes returns single role */
  role?: string;
  organization?: { id: number; name: string };
}

/** Get display label for user roles (API returns roles array) */
export function getRoleDisplayLabel(user: ApiUser): string {
  if (user.roles?.length) return user.roles.map((r) => r.name).join(", ");
  return user.role ?? "";
}

export interface UsersListResponse {
  success: boolean;
  data: ApiUser[];
  message?: string;
}

export interface UserDetailResponse {
  success: boolean;
  data: ApiUser;
  message?: string;
}

/** POST /api/users - Create user in current organization */
export interface CreateUserBody {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  roleId?: number;
}

/** PATCH /api/users/:id - Update user (all fields optional, send only changed) */
export interface UpdateUserBody {
  fullName?: string;
  phone?: string | null;
  isActive?: boolean;
  password?: string;
}
