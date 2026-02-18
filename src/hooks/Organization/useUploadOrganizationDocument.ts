import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrganizationDocumentType } from "@/types/organization";

const uploadOrganizationDocument = async (
  organizationId: number,
  file: File,
  documentType: OrganizationDocumentType
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);
  await axiosInstance.post(`organizations/${organizationId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default function useUploadOrganizationDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      organizationId: number;
      file: File;
      documentType: OrganizationDocumentType;
    }) =>
      uploadOrganizationDocument(params.organizationId, params.file, params.documentType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.organizationId, "documents"],
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
    },
  });
}
