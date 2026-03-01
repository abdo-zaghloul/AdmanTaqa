import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOnboarding } from "@/api/services/onboardingService";
import type { OnboardingUpdateBody } from "@/types/onboarding";
import { toast } from "sonner";

export default function useUpdateOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: OnboardingUpdateBody }) =>
      updateOnboarding(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "detail", variables.id] });
      toast.success("Onboarding item updated");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to update");
    },
  });
}
