import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, UserCheck, FileText } from "lucide-react";
import type { OrganizationMeFullData } from "@/types/organization";
import OrganizationDetailsCard from "./OrganizationDetailsCard";

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

function documentTypeLabel(type: string | null | undefined): string {
  if (!type) return "Document";
  const labels: Record<string, string> = {
    LICENSE: "License",
    REGISTRATION: "Registration",
    OTHER: "Other",
    COMMERCIAL_REGISTRATION: "Commercial Registration",
    TAX_CERTIFICATE: "Tax Certificate",
    TECHNICAL_CERTIFICATE: "Technical Certificate",
    INSURANCE_CERTIFICATE: "Insurance Certificate",
  };
  return labels[type] ?? type;
}

export default function UnifiedProfileCard({ organization, isLoading }: UnifiedProfileCardProps) {
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

        {/* Organization Documents + Service Provider Documents */}
        {((organization?.OrganizationDocuments?.length ?? 0) > 0 ||
          (organization?.ServiceProviderProfile?.ServiceProviderDocuments?.length ?? 0) > 0) && (
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
                    <p className="text-muted-foreground text-xs">
                      {documentTypeLabel(doc.documentType)}
                      {doc.status != null && doc.status !== "" && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">
                          {doc.status}
                        </Badge>
                      )}
                    </p>
                  </div>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs shrink-0"
                    >
                      View
                    </a>
                  )}
                </li>
              ))}
              {organization?.ServiceProviderProfile?.ServiceProviderDocuments?.map((doc) => (
                <li
                  key={`sp-${doc.id}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{doc.fileName ?? doc.documentType ?? "Document"}</p>
                    <p className="text-muted-foreground text-xs">
                      {documentTypeLabel(doc.documentType)}
                      {doc.status != null && doc.status !== "" && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">
                          {doc.status}
                        </Badge>
                      )}
                    </p>
                  </div>
                  {(doc.fileUrl ?? (doc as { url?: string }).url) && (
                    <a
                      href={doc.fileUrl ?? (doc as { url?: string }).url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs shrink-0"
                    >
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
