import { useQuery } from "@tanstack/react-query";
import { fetchStationJobOrderById } from "@/api/services/stationService";

export default function useStationJobOrderById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["station-job-order", id],
    queryFn: () => fetchStationJobOrderById(id!),
    enabled: id != null && id !== "",
  });
}
