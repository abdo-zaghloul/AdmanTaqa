import { useQuery } from "@tanstack/react-query";
import { fetchAuthorityExternalJobOrderTimeline } from "@/api/services/authorityExternalJobOrderService";

export default function useAuthorityExternalJobOrderTimeline(
  id: number | string | null | undefined
) {
  return useQuery({
    queryKey: ["authority-external-job-order-timeline", id],
    queryFn: () => fetchAuthorityExternalJobOrderTimeline(id!),
    enabled: id != null && id !== "",
  });
}
