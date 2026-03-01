import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createQuoteForRfq } from "@/api/services/providerService";
import type { CreateQuoteBody } from "@/types/provider";

export default function useCreateQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rfqId, body }: { rfqId: number | string; body: CreateQuoteBody }) =>
      createQuoteForRfq(rfqId, body),
    onSuccess: (_, { rfqId }) => {
      queryClient.invalidateQueries({ queryKey: ["provider-rfq", rfqId] });
      queryClient.invalidateQueries({ queryKey: ["provider-rfqs"] });
    },
  });
}
