import { useQuery } from "@tanstack/react-query";
import { fetchLinkedProviders } from "@/api/services/stationService";

export default function useLinkedProviders() {
  return useQuery({
    queryKey: ["station", "linked-providers"],
    queryFn: fetchLinkedProviders,
  });
}
