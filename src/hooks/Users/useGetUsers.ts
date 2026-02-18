import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { UsersListResponse } from "@/types/user";

type GetUsersParams = { organizationId?: number | string };

function getUsers(params?: GetUsersParams) {
  const q = params?.organizationId != null ? `?organizationId=${params.organizationId}` : "";
  return axiosInstance.get<UsersListResponse>(`users${q}`).then((r) => r.data);
}

export default function useGetUsers(params?: GetUsersParams) {
  return useQuery({ queryKey: ["users", params], queryFn: () => getUsers(params) });
}
