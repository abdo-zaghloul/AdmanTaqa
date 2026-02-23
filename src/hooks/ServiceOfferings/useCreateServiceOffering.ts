import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateServiceOfferingBody } from "@/types/organization";

const createServiceOffering = async ({
  organizationId,
  body,
}: {
  organizationId: number | string;
  body: CreateServiceOfferingBody;
}) => {
  try {
    const response = await axiosInstance.post(
      `organizations/${organizationId}/service-offerings`,
      body
    );
    return response.data;
  } catch (err) {
     
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
          ? err.message
          : "Failed to create service offering.";
    throw new Error(message);
  }
};

export default function useCreateServiceOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceOffering,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["service-offerings", variables.organizationId],
      });
    },
  });
}
