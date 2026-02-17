import axiosInstance from '@/api/config';
import type { OnboardingItem } from '@/types/onboarding';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const updateOnboardingWithImage = async (
  id: number | string,
  formData: FormData
): Promise<OnboardingItem> => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: OnboardingItem }>(
      `onboarding/${id}`,
      formData
    );
    const data = response.data;
    return data?.data ?? data;
  } catch (error: unknown) {
    console.error('Error updating onboarding image:', (error as { response?: { data?: unknown }; message?: string })?.response?.data || (error as { message?: string })?.message);
    throw error;
  }
};

export default function useUpdateOnboardingWithImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: number | string; formData: FormData }) =>
      updateOnboardingWithImage(id, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'detail', variables.id] });
      toast.success('Onboarding item updated');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update';
      toast.error(errorMessage);
    },
  });
}
