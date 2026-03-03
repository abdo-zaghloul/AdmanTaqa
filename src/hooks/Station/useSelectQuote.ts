import { useMutation, useQueryClient } from "@tanstack/react-query";
import { selectStationRequestQuote } from "@/api/services/stationService";

export default function useSelectQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      providerQuoteId,
    }: {
      requestId: number | string;
      providerQuoteId: number;
    }) => selectStationRequestQuote(requestId, { providerQuoteId }),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["station-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
