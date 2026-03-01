import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequest } from "@/api/services/stationService";
import type { CreateRequestPayload } from "@/types/station";

/** POST /api/requests — create service/maintenance request (maintenance-request-frontend-guide) */
export default function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
      queryClient.invalidateQueries({ queryKey: ["internal-work-orders"] });
    },
  });
}
