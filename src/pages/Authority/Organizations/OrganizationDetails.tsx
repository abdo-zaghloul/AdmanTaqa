import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  FileText,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import useGetOrganizationById from "@/hooks/Organization/useGetOrganizationById";
import useApproveOrganization from "@/hooks/Organization/useApproveOrganization";

export default function OrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orgId = id ?? "";

  const { data: org, isLoading: orgLoading, isError: orgError } = useGetOrganizationById(orgId);
  const approveMutation = useApproveOrganization();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    if (!orgId) return;
    approveMutation.mutate(
      { id: orgId, body: { decision: "APPROVED" } },
      {
        onSuccess: () => {
          toast.success("Organization approved.");
          navigate("/organizations");
        },
        onError: (e) => toast.error((e as Error)?.message ?? "Failed to approve."),
      }
    );
  };

  const handleRejectSubmit = () => {
    if (!orgId) return;
    approveMutation.mutate(
      { id: orgId, body: { decision: "REJECTED", reason: rejectReason || undefined } },
      {
        onSuccess: () => {
          toast.success("Organization rejected.");
          setRejectModalOpen(false);
          setRejectReason("");
          navigate("/organizations");
        },
        onError: (e) => {
          toast.error((e as Error)?.message ?? "Failed to reject.");
        },
      }
    );
  };

  const openRejectModal = () => {
    setRejectReason("");
    setRejectModalOpen(true);
  };

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
          {org.status === "PENDING" ? (
            <>
              <Button
                variant="destructive"
                className="gap-2 shadow-lg"
                onClick={openRejectModal}
                disabled={approveMutation.isPending}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                className="gap-2 shadow-lg bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
            </>
          ) : (
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

          <Card className="border-none shadow-sm shadow-slate-200/50 overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-0 px-0">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
                <div className="p-6 text-center hover:bg-slate-50 transition-colors">
                  <p className="text-3xl font-black text-slate-900 mb-1">{org.type}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Type
                  </p>
                </div>
                <div className="p-6 text-center hover:bg-slate-50 transition-colors">
                  <p className="text-3xl font-black text-slate-900 mb-1">{org.status}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </p>
                </div>
              </div>
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

      {/* Reject Reason Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Organization</DialogTitle>
            <DialogDescription>
              Optionally provide a reason for rejecting this organization. The reason may be shown to the organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason (optional)</Label>
              <Textarea
                id="reject-reason"
                placeholder="e.g. Incomplete documents, missing information..."
                className="min-h-[100px]"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
              disabled={approveMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
