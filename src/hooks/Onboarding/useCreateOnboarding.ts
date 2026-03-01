import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOnboarding } from "@/api/services/onboardingService";
import type { OnboardingCreateBody } from "@/types/onboarding";
import { toast } from "sonner";

export default function useCreateOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OnboardingCreateBody) => createOnboarding(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding"] });
      toast.success("Onboarding item created");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to create");
    },
  });
}
