import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviseProviderQuote } from "@/api/services/providerService";
import type { CreateQuoteBody } from "@/types/provider";

export default function useReviseQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      quoteId,
      body,
    }: {
      quoteId: number | string;
      body: Partial<CreateQuoteBody>;
    }) => reviseProviderQuote(quoteId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-rfqs"] });
      queryClient.invalidateQueries({ queryKey: ["provider-rfq"] });
    },
  });
}
