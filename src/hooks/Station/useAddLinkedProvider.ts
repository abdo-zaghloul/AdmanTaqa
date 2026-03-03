import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLinkedProvider } from "@/api/services/stationService";

export default function useAddLinkedProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { providerOrganizationId: number }) => addLinkedProvider(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station", "linked-providers"] });
      queryClient.invalidateQueries({ queryKey: ["station", "linked-providers", "available"] });
    },
  });
}
