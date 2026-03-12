import { useQuery } from "@tanstack/react-query";
import { fetchAuthorityExternalJobOrderById } from "@/api/services/authorityExternalJobOrderService";

export default function useAuthorityExternalJobOrderById(
  id: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["authority-external-job-order", id],
    queryFn: () => fetchAuthorityExternalJobOrderById(id!),
    enabled: id != null && id !== "",
  });
}
