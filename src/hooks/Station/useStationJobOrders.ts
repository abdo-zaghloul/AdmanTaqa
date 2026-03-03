import { useQuery } from "@tanstack/react-query";
import { fetchStationJobOrders } from "@/api/services/stationService";

export default function useStationJobOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["station-job-orders", params?.status, params?.page, params?.limit],
    queryFn: () => fetchStationJobOrders(params),
  });
}
