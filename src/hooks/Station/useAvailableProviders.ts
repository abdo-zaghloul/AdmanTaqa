import { useQuery } from "@tanstack/react-query";
import { fetchAvailableProviders } from "@/api/services/stationService";

export default function useAvailableProviders() {
  return useQuery({
    queryKey: ["station", "linked-providers", "available"],
    queryFn: fetchAvailableProviders,
  });
}
