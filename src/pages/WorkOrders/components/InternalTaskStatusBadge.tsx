import { Badge } from "@/components/ui/badge";
import type { InternalTaskStatus } from "@/types/internalTask";

type Props = {
  status: InternalTaskStatus | string;
};

export default function InternalTaskStatusBadge({ status }: Props) {
  const styleMap: Record<string, string> = {
    ASSIGNED: "bg-slate-50 text-slate-700 border-slate-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    PAUSED: "bg-amber-50 text-amber-700 border-amber-200",
    WAITING_PARTS: "bg-orange-50 text-orange-700 border-orange-200",
    COMPLETED: "bg-violet-50 text-violet-700 border-violet-200",
    CLOSED: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <Badge className={`${styleMap[status] ?? "bg-muted"} text-xs`}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}
