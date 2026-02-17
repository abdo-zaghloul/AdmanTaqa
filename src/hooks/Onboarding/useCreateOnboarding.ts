import axiosInstance from '@/api/config';
import type { OnboardingItem, OnboardingCreateBody } from '@/types/onboarding';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const createOnboarding = async (body: OnboardingCreateBody): Promise<OnboardingItem> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: OnboardingItem }>(
      'onboarding',
      body
    );
    const data = response.data;
    return data?.data ?? data;
  } catch (error: unknown) {
    console.error('Error creating onboarding:', (error as { response?: { data?: unknown }; message?: string })?.response?.data || (error as { message?: string })?.message);
    throw error;
  }
};

export default function useCreateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: OnboardingCreateBody) => createOnboarding(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      toast.success('Onboarding item created');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create';
      toast.error(errorMessage);
    },
  });
}
