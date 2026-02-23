export interface AuditLogItem {
  id: number;
  userId: number | null;
  organizationId: number | null;
  branchId: number | null;
  action: string;
  resourceType: string;
  resourceId: string;
  ip: string | null;
  createdAt: string;
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
