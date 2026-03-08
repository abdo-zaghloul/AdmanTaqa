import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addProviderJobOrderAttachment,
  uploadProviderJobOrderAttachment,
} from "@/api/services/providerService";

type AddByUrlPayload = {
  jobOrderId: string | number;
  fileUrl: string;
  description?: string;
};

type UploadFilePayload = {
  jobOrderId: string | number;
  file: File;
  description?: string;
};

export default function useUploadProviderJobOrderAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddByUrlPayload | UploadFilePayload) => {
      if ("file" in payload && payload.file instanceof File) {
        return uploadProviderJobOrderAttachment(
          payload.jobOrderId,
          payload.file,
          payload.description
        );
      }
      const byUrl = payload as AddByUrlPayload;
      return addProviderJobOrderAttachment(payload.jobOrderId, {
        fileUrl: byUrl.fileUrl,
        description: byUrl.description,
      });
    },
    onSuccess: (_, payload) => {
      const jobOrderId = payload.jobOrderId;
      queryClient.invalidateQueries({
        queryKey: ["provider-job-order-attachments", String(jobOrderId)],
      });
      queryClient.invalidateQueries({ queryKey: ["provider-job-order", String(jobOrderId)] });
    },
  });
}
