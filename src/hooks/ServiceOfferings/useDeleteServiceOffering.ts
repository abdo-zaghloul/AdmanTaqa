import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteServiceOffering = async ({
  organizationId,
  offeringId,
}: {
  organizationId: number | string;
  offeringId: number | string;
}) => {
  const response = await axiosInstance.delete(
    `organizations/${organizationId}/service-offerings/${offeringId}`
  );
  return response.data;
};

export default function useDeleteServiceOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServiceOffering,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-offerings", variables.organizationId],
      });
    },
  });
}
