import axiosInstance from '@/api/config';
import type { OnboardingItem } from '@/types/onboarding';
import { useQuery } from '@tanstack/react-query';

const getOnboardingById = async (id: number | string): Promise<OnboardingItem> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: OnboardingItem }>(
      `onboarding/${id}`
    );
    const data = response.data;
    return data?.data ?? data;
  } catch (error: unknown) {
    console.error('Error fetching onboarding item:', (error as { response?: { data?: unknown }; message?: string })?.response?.data || (error as { message?: string })?.message);
    throw error;
  }
};

export default function useGetOnboardingById(id: string | number | undefined) {
  return useQuery({
    queryKey: ['onboarding', 'detail', id],
    queryFn: () => getOnboardingById(id!),
    enabled: id !== undefined && id !== '',
  });
}
