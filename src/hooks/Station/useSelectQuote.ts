import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectStationRequestQuote } from "@/api/services/stationService";

export default function useSelectQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      quoteId,
    }: {
      requestId: number | string;
      quoteId: number;
    }) => selectStationRequestQuote(requestId, { quoteId }),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["station-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
