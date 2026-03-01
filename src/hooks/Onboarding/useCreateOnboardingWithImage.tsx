import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOnboardingWithImage } from "@/api/services/onboardingService";
import { toast } from "sonner";

export default function useCreateOnboardingWithImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createOnboardingWithImage(formData),
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
