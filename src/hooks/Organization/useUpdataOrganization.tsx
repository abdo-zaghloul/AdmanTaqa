import axiosInstance from '@/api/config';
import type { OrganizationResponse } from '@/types/organization';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const updateOrganization = async (data: { name: string }): Promise<OrganizationResponse> => {
  try {
    const response = await axiosInstance.patch("organizations/me", data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating organization:", error.response?.data || error.message);
    throw error;
  }
};

export default function useUpdataOrganization() {

  const queryClient = useQueryClient();

  return (
    useMutation({
      mutationFn: (data: { name: string }) => updateOrganization(data),
      onSuccess: (response) => {
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["organization"] });
          toast.success(response.message || "Organization updated successfully");
        } else {
          toast.error(response.message || "Update failed");
        }
      },
      onError: (error:any) => {
        const errorMessage = error.response?.data?.message || "An error occurred during update";
        toast.error(errorMessage);
      },
    })
  )
}
