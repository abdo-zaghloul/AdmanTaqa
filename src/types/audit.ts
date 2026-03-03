export interface AuditLogItem {
  id: number;
  userId: number | null;
  organizationId: number | null;
  branchId: number | null;
  action: string;
  resourceType: string;
  resourceId: string;
  ip: string | null;
  details?: unknown;
  createdAt: string;
  User?: { id: number; fullName?: string; email?: string } | null;
  Organization?: { id: number; name?: string } | null;
  Branch?: { id: number; nameEn?: string; nameAr?: string } | null;
}

export interface AuditListData {
  items: AuditLogItem[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditListResponse {
  success: boolean;
  data: AuditListData;
  message?: string;
}
