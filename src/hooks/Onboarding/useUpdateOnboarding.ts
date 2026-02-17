import axiosInstance from '@/api/config';
import type { OnboardingItem, OnboardingUpdateBody } from '@/types/onboarding';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const updateOnboarding = async (
  id: number | string,
  body: OnboardingUpdateBody
): Promise<OnboardingItem> => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: OnboardingItem }>(
      `onboarding/${id}`,
      body
    );
    const data = response.data;
    return data?.data ?? data;
  } catch (error: unknown) {
    console.error('Error updating onboarding:', (error as { response?: { data?: unknown }; message?: string })?.response?.data || (error as { message?: string })?.message);
    throw error;
  }
};

export default function useUpdateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: OnboardingUpdateBody }) =>
      updateOnboarding(id, body),
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
