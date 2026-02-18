import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload } from "lucide-react";
import useGetOrganizationDocuments from "@/hooks/Organization/useGetOrganizationDocuments";
import useUploadOrganizationDocument from "@/hooks/Organization/useUploadOrganizationDocument";
import type { OrganizationDocument, OrganizationDocumentType } from "@/types/organization";
import { toast } from "sonner";

const DOC_TYPES: { value: OrganizationDocumentType; label: string }[] = [
  { value: "LICENSE", label: "License" },
  { value: "REGISTRATION", label: "Registration" },
  { value: "OTHER", label: "Other" },
];

interface ProfileDocumentsCardProps {
  organizationId: number;
}

export default function ProfileDocumentsCard({ organizationId }: ProfileDocumentsCardProps) {
  const { data: documents = [], isLoading } = useGetOrganizationDocuments(organizationId);
  const uploadMutation = useUploadOrganizationDocument();
  const [documentType, setDocumentType] = useState<OrganizationDocumentType>("LICENSE");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(
      { organizationId, file, documentType },
      {
        onSuccess: () => {
          toast.success("Document uploaded.");
          e.target.value = "";
        },
        onError: (err) => toast.error((err as Error)?.message ?? "Upload failed."),
      }
    );
  };

  const getDocUrl = (doc: OrganizationDocument) => doc.url ?? doc.fileUrl ?? "#";

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
        <CardDescription>Upload and manage organization documents.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Document type</Label>
            <Select value={documentType} onValueChange={(v) => setDocumentType(v as OrganizationDocumentType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No documents uploaded yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <span className="font-medium">{doc.fileName ?? doc.documentType ?? "Document"}</span>
                <a href={getDocUrl(doc)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
