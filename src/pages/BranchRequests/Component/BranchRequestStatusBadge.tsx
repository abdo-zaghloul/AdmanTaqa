import { Badge } from "@/components/ui/badge";
import type { BranchRequestStatus } from "@/types/branchRequest";

export default function BranchRequestStatusBadge({
  status,
}: {
  status: BranchRequestStatus;
}) {
  const classes: Record<BranchRequestStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    UNDER_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
    APPROVED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Badge className={`${classes[status]} border shadow-none font-medium text-[10px]`}>
      {status.replace("_", " ")}
    </Badge>
  );
}
