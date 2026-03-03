import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLinkedProvider } from "@/api/services/stationService";

export default function useRemoveLinkedProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (linkId: number | string) => removeLinkedProvider(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station", "linked-providers"] });
      queryClient.invalidateQueries({ queryKey: ["station", "linked-providers", "available"] });
    },
  });
}
