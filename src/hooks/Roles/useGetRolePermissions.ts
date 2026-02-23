import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { PermissionItem, PermissionsListResponse } from "@/types/role";
import { normalizePermissions } from "./utils";

const getRolePermissions = async (): Promise<PermissionItem[]> => {
  const response = await axiosInstance.get<PermissionsListResponse>(
    "roles/permissions"
  );
  return normalizePermissions(response.data);
};

export default function useGetRolePermissions() {
  return useQuery({
    queryKey: ["role-permissions"],
    queryFn: getRolePermissions,
  });
}
