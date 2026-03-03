import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectStationRequestQuote } from "@/api/services/stationService";

export default function useRejectQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      providerQuoteId,
      rejectionReason,
    }: {
      requestId: number | string;
      providerQuoteId: number;
      rejectionReason: string;
    }) => rejectStationRequestQuote(requestId, { providerQuoteId, rejectionReason }),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ["station-request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
    },
  });
}
