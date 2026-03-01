import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendStationRequestToProviders } from "@/api/services/stationService";

export default function useSendToProviders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      providerOrganizationIds,
    }: {
      requestId: number | string;
      providerOrganizationIds: number[];
    }) => sendStationRequestToProviders(requestId, { providerOrganizationIds }),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["station-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
