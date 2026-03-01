import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaintenanceRequest } from "@/api/services/stationService";
import type { MaintenanceRequestBody } from "@/types/station";

export default function useCreateMaintenanceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: MaintenanceRequestBody) => createMaintenanceRequest(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
