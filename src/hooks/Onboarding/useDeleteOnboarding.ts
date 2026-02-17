import axiosInstance from '@/api/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const deleteOnboarding = async (id: number | string): Promise<void> => {
  try {
    await axiosInstance.delete(`onboarding/${id}`);
  } catch (error: unknown) {
    console.error('Error deleting onboarding:', (error as { response?: { data?: unknown }; message?: string })?.response?.data || (error as { message?: string })?.message);
    throw error;
  }
};

export default function useDeleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteOnboarding(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding', 'detail', id] });
      toast.success('Onboarding item deleted');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to delete';
      toast.error(errorMessage);
    },
  });
}
