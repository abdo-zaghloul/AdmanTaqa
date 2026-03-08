import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building2, UserCheck, FileText, Upload } from "lucide-react";
import type { OrganizationMeFullData } from "@/types/organization";
import type { ServiceProviderProfileDocumentType } from "@/types/organization";
import OrganizationDetailsCard from "./OrganizationDetailsCard";
import ProfileServiceProviderProfileCard from "./ProfileServiceProviderProfileCard";
import useGetServiceProviderProfileDocuments from "@/hooks/Organization/useGetServiceProviderProfileDocuments";
import useUploadServiceProviderProfileDocument from "@/hooks/Organization/useUploadServiceProviderProfileDocument";
import { toast } from "sonner";

const PROFILE_DOC_TYPES: { value: ServiceProviderProfileDocumentType; label: string }[] = [
  { value: "COMMERCIAL_REGISTRATION", label: "Commercial Registration" },
  { value: "TAX_CERTIFICATE", label: "Tax Certificate" },
  { value: "TECHNICAL_CERTIFICATE", label: "Technical Certificate" },
  { value: "INSURANCE_CERTIFICATE", label: "Insurance Certificate" },
];

interface UnifiedProfileCardProps {
  organization: OrganizationMeFullData | null | undefined;
  isLoading?: boolean;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UnifiedProfileCard({ organization, isLoading }: UnifiedProfileCardProps) {
  const orgId = organization?.id;
  const isSPWithProfile =
    organization?.type === "SERVICE_PROVIDER" && !!organization?.ServiceProviderProfile?.id;
  const { data: profileDocs = [] } =
    useGetServiceProviderProfileDocuments(orgId ?? 0, !!isSPWithProfile);
  const uploadDocMutation = useUploadServiceProviderProfileDocument();
  const [profileDocType, setProfileDocType] =
    useState<ServiceProviderProfileDocumentType>("COMMERCIAL_REGISTRATION");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadProfileDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orgId) return;
    uploadDocMutation.mutate(
      { organizationId: orgId, file, documentType: profileDocType },
      {
        onSuccess: () => {
          toast.success("Document uploaded.");
          e.target.value = "";
        },
        onError: (err) => toast.error((err as Error)?.message ?? "Upload failed."),
      }
    );
  };

  const getDocUrl = (doc: { url?: string; fileUrl?: string }) => doc.url ?? doc.fileUrl ?? "#";

  const hasOrgDocs =
    organization?.OrganizationDocuments && organization.OrganizationDocuments.length > 0;
  const hasProfileDocs = profileDocs.length > 0;
  const showDocumentsSection = hasOrgDocs || hasProfileDocs || isSPWithProfile;

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardContent className="py-12">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="border-b bg-muted/30 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{organization?.name}</CardTitle>
              <CardDescription>{organization?.type}</CardDescription>
              {organization?.status === "APPROVED" && organization?.approvedAt && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  Approved by {organization.User?.fullName ?? "—"} on {formatDate(organization.approvedAt)}
                </p>
              )}
            </div>
          </div>
          {organization?.status && (
            <Badge className="px-3 py-1 text-xs" variant={organization.status === "APPROVED" ? "default" : "secondary"}>
              {organization.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <OrganizationDetailsCard organization={organization} embedded />

        {/* Service Provider Profile */}
        {organization?.type === "SERVICE_PROVIDER" && organization?.id && (
          <ProfileServiceProviderProfileCard organizationId={organization.id} embedded />
        )}

        {/* Documents (Organization + Profile Documents together) — last */}
        {showDocumentsSection && (
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </h3>
            <ul className="space-y-2">
              {organization?.OrganizationDocuments?.map((doc) => (
                <li
                  key={`org-${doc.id}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{doc.fileName ?? "—"}</p>
                    <p className="text-muted-foreground text-xs">{doc.documentType}</p>
                  </div>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      View
                    </a>
                  )}
                </li>
              ))}
              {profileDocs.map((doc) => (
                <li
                  key={`sp-${doc.id}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{doc.fileName ?? doc.documentType ?? "Document"}</p>
                    <p className="text-muted-foreground text-xs">{doc.documentType}</p>
                  </div>
                  <a
                    href={getDocUrl(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
            {isSPWithProfile && (
              <div className="flex flex-wrap items-end gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={profileDocType}
                    onChange={(e) =>
                      setProfileDocType(e.target.value as ServiceProviderProfileDocumentType)
                    }
                  >
                    {PROFILE_DOC_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleUploadProfileDoc}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadDocMutation.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadDocMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
