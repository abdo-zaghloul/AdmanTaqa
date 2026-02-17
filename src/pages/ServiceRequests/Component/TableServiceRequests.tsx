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
import { Building2, MapPin, Eye, ArrowUpRight } from "lucide-react";

export type ServiceRequestRow = {
  id: string;
  subject: string;
  station: string;
  branch: string;
  status: string;
  priority: string;
  createdAt: string;
};

type TableServiceRequestsProps = {
  requests: ServiceRequestRow[];
};

function getStatusStyle(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "CLOSED":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-gray-50";
  }
}

function getPriorityBadge(priority: string) {
  const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
    URGENT: "destructive",
    HIGH: "default",
    MEDIUM: "secondary",
    LOW: "outline",
  };
  return (
    <Badge
      variant={variants[priority] || "outline"}
      className="text-[10px] font-bold px-1.5 py-0"
    >
      {priority}
    </Badge>
  );
}

export default function TableServiceRequests({ requests }: TableServiceRequestsProps) {
  const navigate = useNavigate();

  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/20">
          <TableRow>
            <TableHead className="w-[150px] font-bold">Request ID</TableHead>
            <TableHead className="font-bold">Subject & Priority</TableHead>
            <TableHead className="font-bold">Station / Branch</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No service requests found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow
                key={req.id}
                className="group hover:bg-muted/30 transition-all border-b border-muted/20 last:border-0"
              >
                <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                  {req.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {req.subject}
                    </span>
                    <div className="flex items-center gap-2">{getPriorityBadge(req.priority)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {req.station}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {req.branch}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-muted-foreground">
                  {new Date(req.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusStyle(req.status)} border shadow-none font-medium capitalize`}
                  >
                    {req.status.toLowerCase().replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 hover:bg-primary hover:text-white transition-all"
                    onClick={() => navigate(`/service-requests/${req.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                    <ArrowUpRight className="h-3 w-3" />
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
