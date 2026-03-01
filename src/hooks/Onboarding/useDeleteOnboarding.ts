import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOnboarding } from "@/api/services/onboardingService";
import { toast } from "sonner";

export default function useDeleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteOnboarding(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "detail", id] });
      toast.success("Onboarding item deleted");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to delete");
    },
  });
}
