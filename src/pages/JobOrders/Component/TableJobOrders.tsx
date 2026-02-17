import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Eye,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  Calendar,
  ArrowRightCircle,
} from "lucide-react";

export type JobOrderRow = {
  id: string;
  title: string;
  provider: string;
  branch: string;
  startDate: string;
  endDate: string;
  status: string;
};

type TableJobOrdersProps = {
  orders: JobOrderRow[];
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    PLANNED: "bg-purple-50 text-purple-700 border-purple-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    COMPLETED: CheckCircle2,
    IN_PROGRESS: PlayCircle,
    PLANNED: Calendar,
    PENDING: PauseCircle,
  };

  const StatusIcon = icons[status] || ArrowRightCircle;

  return (
    <Badge
      className={`${styles[status] || "bg-gray-50"} border shadow-none font-medium gap-1 text-[10px]`}
    >
      <StatusIcon className="h-3 w-3" />
      {status.replace("_", " ")}
    </Badge>
  );
}

export default function TableJobOrders({ orders }: TableJobOrdersProps) {
  const navigate = useNavigate();

  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold text-foreground">Order ID</TableHead>
            <TableHead className="font-bold text-foreground">Title</TableHead>
            <TableHead className="font-bold text-foreground">Service Provider</TableHead>
            <TableHead className="font-bold text-foreground">Dates</TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
            <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No job orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-muted/20 transition-all border-b last:border-0 border-muted/20"
              >
                <TableCell className="font-mono text-xs font-bold text-primary/70">{order.id}</TableCell>
                <TableCell className="font-semibold text-sm">{order.title}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{order.provider}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {order.branch}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <PlayCircle className="h-3 w-3 text-green-600" />
                      {order.startDate}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-slate-400" />
                      {order.endDate}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 hover:bg-primary/5 hover:text-primary transition-all rounded-md"
                    onClick={() => navigate(`/job-orders/${order.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
}
