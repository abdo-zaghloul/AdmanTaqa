import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectStationRequestQuote } from "@/api/services/stationService";

export default function useRejectQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      quoteId,
      reason,
    }: {
      requestId: number | string;
      quoteId: number;
      reason: string;
    }) => rejectStationRequestQuote(requestId, { quoteId, reason }),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["station-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
