import { useQuery } from "@tanstack/react-query";
import { fetchStationRequestById } from "@/api/services/stationService";

export default function useStationRequestById(id: number | string | null | undefined) {
  return useQuery({
    queryKey: ["station-request", id],
    queryFn: () => fetchStationRequestById(id!),
    enabled: id != null && id !== "",
  });
}
