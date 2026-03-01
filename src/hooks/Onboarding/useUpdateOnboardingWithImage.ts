import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOnboardingWithImage } from "@/api/services/onboardingService";
import { toast } from "sonner";

export default function useUpdateOnboardingWithImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      updateOnboardingWithImage(id, formData),
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
