import { useQuery } from "@tanstack/react-query";
import { fetchAuthorityExternalJobOrderReports } from "@/api/services/authorityExternalJobOrderService";

export default function useAuthorityExternalJobOrderReports(
  id: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["authority-external-job-order-reports", id],
    queryFn: () => fetchAuthorityExternalJobOrderReports(id!),
    enabled: id != null && id !== "",
  });
}
