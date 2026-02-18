import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type { ApiUser, UserDetailResponse } from "@/types/user";

async function getUserById(id: number | string): Promise<ApiUser | null> {
  const res = await axiosInstance.get<UserDetailResponse>(`users/${id}`);
  return res.data?.data ?? null;
}

export default function useGetUserById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: id != null && id !== "",
  });
}
