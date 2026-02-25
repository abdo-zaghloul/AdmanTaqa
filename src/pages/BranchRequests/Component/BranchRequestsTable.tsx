import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BranchRequestItem } from "@/types/branchRequest";
import BranchRequestStatusBadge from "./BranchRequestStatusBadge";
import RejectBranchRequestDialog from "./RejectBranchRequestDialog";
import useApproveBranchRequest from "@/hooks/BranchRequests/useApproveBranchRequest";
import useRejectBranchRequest from "@/hooks/BranchRequests/useRejectBranchRequest";

type BranchRequestsTableProps = {
  items: BranchRequestItem[];
  isAuthority: boolean;
};

export default function BranchRequestsTable({
  items,
  isAuthority,
}: BranchRequestsTableProps) {
  const navigate = useNavigate();
  const approveMutation = useApproveBranchRequest();
  const rejectMutation = useRejectBranchRequest();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
console.log(items);

  const canReview = (status: string) =>
    status === "PENDING" || status === "UNDER_REVIEW";

  const onApprove = (id: number) => {
    approveMutation.mutate(id, {
      onSuccess: () => toast.success("Branch request approved."),
      onError: (err) =>
        toast.error(err instanceof Error ? err.message : "Failed to approve request."),
    });
  };

  const onOpenReject = (id: number) => {
    setRejectTargetId(id);
    setRejectOpen(true);
  };

  const onRejectSubmit = (reason?: string) => {
    if (!rejectTargetId) return;
    rejectMutation.mutate(
      { id: rejectTargetId, body: { reason } },
      {
        onSuccess: () => {
          toast.success("Branch request rejected.");
          setRejectOpen(false);
          setRejectTargetId(null);
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to reject request."),
      }
    );
  };

  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead>Reference Code</TableHead>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No branch requests found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/20 transition-all">
                <TableCell className="font-mono text-xs">
                  {item.referenceCode || `BR-${item.id}`}
                </TableCell>
                <TableCell>{item.nameEn || "N/A"}</TableCell>
                <TableCell>
                  <BranchRequestStatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {item.branchId != null ? `#${item.branchId}` : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/branch-requests/${item.id}`)}
                    >
                      View
                    </Button>
                    {isAuthority && canReview(item.status) && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onApprove(item.id)}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onOpenReject(item.id)}
                          disabled={rejectMutation.isPending}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <RejectBranchRequestDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        isPending={rejectMutation.isPending}
        onSubmit={onRejectSubmit}
      />
    </CardContent>
  );
}
