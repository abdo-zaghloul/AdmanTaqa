import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import useGetBranchRequestById from "@/hooks/BranchRequests/useGetBranchRequestById";
import useApproveBranchRequest from "@/hooks/BranchRequests/useApproveBranchRequest";
import useRejectBranchRequest from "@/hooks/BranchRequests/useRejectBranchRequest";
import BranchRequestStatusBadge from "./Component/BranchRequestStatusBadge";
import RejectBranchRequestDialog from "./Component/RejectBranchRequestDialog";

export default function BranchRequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = id ? Number(id) : null;
  const [rejectOpen, setRejectOpen] = useState(false);


  const { data: orgResponse } = useGetOrganization();
  console.log(orgResponse);

  const organization = orgResponse?.data;
  const isAuthority = organization?.type === "AUTHORITY";

  const { data: request, isLoading, isError, error } = useGetBranchRequestById(numericId);
  const approveMutation = useApproveBranchRequest();
  const rejectMutation = useRejectBranchRequest();

  const canReview =
    request?.status === "PENDING" || request?.status === "UNDER_REVIEW";

  const onApprove = () => {
    if (!request) return;
    approveMutation.mutate(request.id, {
      onSuccess: () => toast.success("Branch request approved."),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Failed to approve request."),
    });
  };

  const onReject = (reason?: string) => {
    if (!request) return;
    rejectMutation.mutate(
      { id: request.id, body: { reason } },
      {
        onSuccess: () => {
          toast.success("Branch request rejected.");
          setRejectOpen(false);
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to reject request."),
      }
    );
  };

  if (isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading request...</div>;
  }

  if (isError || !request) {
    return (
      <div className="p-8 text-sm text-destructive">
        {error instanceof Error ? error.message : "Request not found."}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Request Details</h1>
          <p className="text-muted-foreground">
            {request.referenceCode || `Request #${request.id}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BranchRequestStatusBadge status={request.status} />
          <Button variant="outline" onClick={() => navigate("/branch-requests")}>
            Back
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Request Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name (EN)</p>
            <p className="font-medium">{request.nameEn || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Name (AR)</p>
            <p className="font-medium">{request.nameAr || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Area ID</p>
            <p className="font-medium">{request.areaId ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Station Type ID</p>
            <p className="font-medium">{request.stationTypeId ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">License Number</p>
            <p className="font-medium">{request.licenseNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Branch ID (after approval)</p>
            <p className="font-medium">{request.branchId ?? "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{request.address || "N/A"}</p>
          </div>
          {request.rejectionReason && (
            <div className="md:col-span-2">
              <p className="text-muted-foreground">Rejection Reason</p>
              <p className="font-medium text-destructive">{request.rejectionReason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isAuthority && canReview && (
        <div className="flex gap-2">
          <Button onClick={onApprove} disabled={approveMutation.isPending}>
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setRejectOpen(true)}
            disabled={rejectMutation.isPending}
          >
            Reject
          </Button>
        </div>
      )}

      <RejectBranchRequestDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        isPending={rejectMutation.isPending}
        onSubmit={onReject}
      />
    </div>
  );
}
