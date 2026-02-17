import axiosInstance from '@/api/config';
import type { OnboardingItem } from '@/types/onboarding';
import type { PaginatedResponse } from '@/types/pagination';
import { useQuery } from '@tanstack/react-query';

const getOnboardingPaginated = async (
  page: number,
  limit: number,
  all = true
): Promise<PaginatedResponse<OnboardingItem>> => {
  try {
    const response = await axiosInstance.get<{ success?: boolean; data: OnboardingItem[]; total: number; page: number; totalPages?: number }>(
      'onboarding/paginated',
      { params: { page, limit, all: all ? 'true' : undefined } }
    );
    const body = response.data;
    const data = Array.isArray(body.data) ? body.data : [];
    const total = typeof body.total === 'number' ? body.total : data.length;
    const totalPages = typeof body.totalPages === 'number' ? body.totalPages : Math.ceil(total / limit) || 1;
    return {
      data,
      total,
      page: typeof body.page === 'number' ? body.page : page,
      totalPages,
    };
  } catch (error: unknown) {
    console.error(
      'Error fetching onboarding:',
      (error as { response?: { data?: unknown }; message?: string })?.response?.data ||
        (error as { message?: string })?.message
    );
    throw error;
  }
};

export default function useGetOnboarding(page: number, limit: number, all = true) {
  return useQuery({
    queryKey: ['onboarding', 'paginated', { page, limit, all }],
    queryFn: () => getOnboardingPaginated(page, limit, all),
  });
}
