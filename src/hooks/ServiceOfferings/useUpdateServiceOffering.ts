import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateServiceOfferingBody } from "@/types/organization";

const updateServiceOffering = async ({
  organizationId,
  offeringId,
  body,
}: {
  organizationId: number | string;
  offeringId: number | string;
  body: UpdateServiceOfferingBody;
}) => {
  const response = await axiosInstance.patch(
    `organizations/${organizationId}/service-offerings/${offeringId}`,
    body
  );
  return response.data;
};

export default function useUpdateServiceOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateServiceOffering,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-offerings", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "service-offering",
          variables.organizationId,
          variables.offeringId,
        ],
      });
    },
  });
}
