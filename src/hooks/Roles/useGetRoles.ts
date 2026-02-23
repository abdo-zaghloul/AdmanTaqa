import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { RoleItem, RolesListResponse } from "@/types/role";
import { normalizeRolesList } from "./utils";

const getRoles = async (): Promise<RoleItem[]> => {
  const response = await axiosInstance.get<RolesListResponse>("roles");
  return normalizeRolesList(response.data);
};

export default function useGetRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}
