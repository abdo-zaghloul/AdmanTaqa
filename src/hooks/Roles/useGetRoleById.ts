import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { RoleItem, RoleResponse } from "@/types/role";
import { normalizeRole } from "./utils";

const getRoleById = async (id: string | number): Promise<RoleItem> => {
  const response = await axiosInstance.get<RoleResponse>(`roles/${id}`);
  const role = normalizeRole(response.data?.data ?? response.data);
  if (!role) {
    throw new Error("Role not found.");
  }
  return role;
};

export default function useGetRoleById(id: string | number | null | undefined) {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => getRoleById(id!),
    enabled: id != null && id !== "",
  });
}
