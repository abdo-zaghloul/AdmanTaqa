import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProviderJobOrderAttachment } from "@/api/services/providerService";

export default function useUploadProviderJobOrderAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobOrderId, file }: { jobOrderId: string | number; file: File }) =>
      uploadProviderJobOrderAttachment(jobOrderId, file),
    onSuccess: (_, { jobOrderId }) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-job-order-attachments", String(jobOrderId)],
      });
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
    },
  });
}
