/** User as returned from GET /api/users and GET /api/users/:id */
export interface ApiUser {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  organizationId: number;
  isActive?: boolean;
  role?: string;
  organization?: { id: number; name: string };
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
}
