import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadJobOrderReceipt } from "@/api/services/stationService";

export default function useUploadJobOrderReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobOrderId, file }: { jobOrderId: number | string; file: File }) =>
      uploadJobOrderReceipt(jobOrderId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station-requests"] });
      queryClient.invalidateQueries({ queryKey: ["station-request"] });
      queryClient.invalidateQueries({ queryKey: ["station-job-order"] });
      queryClient.invalidateQueries({ queryKey: ["station-job-orders"] });
    },
  });
}
