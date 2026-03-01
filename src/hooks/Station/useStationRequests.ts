import { useQuery } from "@tanstack/react-query";
import { fetchStationRequests } from "@/api/services/stationService";

export default function useStationRequests(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["station-requests", params?.status, params?.page, params?.limit],
    queryFn: () => fetchStationRequests(params),
  });
}
