import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawProviderQuote } from "@/api/services/providerService";

export default function useWithdrawQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quoteId: number | string) => withdrawProviderQuote(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-rfq"] });
      queryClient.invalidateQueries({ queryKey: ["provider-rfqs"] });
    },
  });
}
