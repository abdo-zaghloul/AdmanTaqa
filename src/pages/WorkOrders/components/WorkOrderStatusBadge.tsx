import { Badge } from "@/components/ui/badge";
import type { WorkOrderStatus } from "@/types/workOrder";

type Props = {
  status: WorkOrderStatus | string;
};

export default function WorkOrderStatusBadge({ status }: Props) {
  if (status === "CLOSED") {
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
        CLOSED
      </Badge>
    );
  }
  if (status === "UNDER_REVIEW") {
    return (
      <Badge className="bg-violet-50 text-violet-700 border-violet-200 text-xs">
        UNDER REVIEW
      </Badge>
    );
  }
  if (status === "IN_PROGRESS") {
    return (
      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
        IN PROGRESS
      </Badge>
    );
  }
  if (status === "PENDING") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
        PENDING
      </Badge>
    );
  }
  return <Badge variant="outline">{status}</Badge>;
}
