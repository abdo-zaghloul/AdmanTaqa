import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServiceProviderProfileDocumentType } from "@/types/organization";

const uploadServiceProviderProfileDocument = async (
  organizationId: number | string,
  file: File,
  documentType: ServiceProviderProfileDocumentType
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);
  await axiosInstance.post(
    `organizations/${organizationId}/service-provider-profile/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export default function useUploadServiceProviderProfileDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      organizationId: number | string;
      file: File;
      documentType: ServiceProviderProfileDocumentType;
    }) =>
      uploadServiceProviderProfileDocument(
        params.organizationId,
        params.file,
        params.documentType
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfileDocuments", variables.organizationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", variables.organizationId],
      });
    },
  });
}
