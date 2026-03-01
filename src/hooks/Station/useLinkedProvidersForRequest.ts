import { useQuery } from "@tanstack/react-query";
import { fetchLinkedProvidersForRequest } from "@/api/services/stationService";

/** GET /api/requests/linked-providers — for external maintenance request "Send to providers" */
export default function useLinkedProvidersForRequest() {
  return useQuery({
    queryKey: ["requests", "linked-providers"],
    queryFn: fetchLinkedProvidersForRequest,
  });
}
