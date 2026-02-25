import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadInternalTaskAttachment } from "@/api/services/internalTaskService";

type Payload = {
  id: number | string;
  file: File;
  workOrderId?: number | string;
};

export default function useUploadInternalTaskAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: Payload) => uploadInternalTaskAttachment(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["internal-tasks"] });
      if (variables.workOrderId != null) {
        queryClient.invalidateQueries({ queryKey: ["work-order", variables.workOrderId] });
      }
    },
  });
}
