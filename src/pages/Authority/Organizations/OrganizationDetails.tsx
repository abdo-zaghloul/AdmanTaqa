import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  FileText,
} from "lucide-react";
import useGetOrganizationById from "@/hooks/Organization/useGetOrganizationById";
import useGetOrganizationDocuments from "@/hooks/Organization/useGetOrganizationDocuments";
import OrganizationActions from "./Component/OrganizationActions";

export default function OrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orgId = id ?? "";

  const { data: org, isLoading: orgLoading, isError: orgError } = useGetOrganizationById(orgId);
  const {
    data: documents = [],
    isLoading: documentsLoading,
  } = useGetOrganizationDocuments(org?.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 gap-1.5 px-3 py-1 shadow-none font-bold uppercase text-[10px]">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 px-3 py-1 shadow-none font-bold uppercase text-[10px]">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 gap-1.5 px-3 py-1 shadow-none font-bold uppercase text-[10px]">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocUrl = (url?: string, fileUrl?: string) => url ?? fileUrl ?? "#";

  const getDocTypeLabel = (documentType?: string) => {
    switch (documentType) {
      case "LICENSE":
        return "License";
      case "REGISTRATION":
        return "Registration";
      case "OTHER":
        return "Other";
      default:
        return documentType ?? "Document";
    }
  };

  if (orgLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (orgError || !org) {
    return (
      <div className="p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/organizations")} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
          Organization not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/organizations")}
            className="rounded-full hover:bg-white shadow-sm border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
              {getStatusBadge(org.status)}
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="font-mono text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                ID: {org.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium uppercase tracking-wider">
                {org.type.replace("_", " ")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <OrganizationActions
            orgId={org.id}
            orgName={org.name}
            status={org.status}
            onSuccess={() => navigate("/organizations")}
          />
          {org.status !== "PENDING" && (
            <Button variant="outline" className="gap-2 shadow-sm">
              <Shield className="h-4 w-4" />
              Manage Permissions
            </Button>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Registration Date
                    </p>
                    <p className="text-sm font-semibold">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {org.approvedAt && (
                    <div className="group">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved At
                      </p>
                      <p className="text-sm font-semibold">
                        {new Date(org.approvedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {org.rejectionReason && (
                    <div className="group">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        Rejection Reason
                      </p>
                      <p className="text-sm text-slate-600">{org.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {documentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No documents uploaded yet.</p>
              ) : (
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {doc.fileName ?? getDocTypeLabel(doc.documentType)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {getDocTypeLabel(doc.documentType)}
                          {doc.createdAt ? ` • ${new Date(doc.createdAt).toLocaleDateString()}` : ""}
                        </p>
                      </div>
                      <a
                        href={getDocUrl(doc.url, doc.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 rounded-xl border bg-slate-50/50 border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Current
                  </span>
                  {getStatusBadge(org.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
