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
import { Building2, MapPin, Calendar, Eye } from "lucide-react";

export type InspectionRow = {
  id: string;
  target: string;
  branch: string;
  type: string;
  inspector: string;
  status: string;
  findings: string;
  date: string;
};

type TableInspectionsProps = {
  inspections: InspectionRow[];
  searchQuery: string;
};

function getStatusBadge(status: string) {
  const variants: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <Badge className={`${variants[status] || "bg-slate-50"} border font-semibold text-[10px] gap-1.5`}>
      <div
        className={`h-1.5 w-1.5 rounded-full ${
          status === "COMPLETED" ? "bg-green-500" : status === "IN_PROGRESS" ? "bg-blue-500" : "bg-slate-400"
        }`}
      />
      {status}
    </Badge>
  );
}

export default function TableInspections({ inspections, searchQuery }: TableInspectionsProps) {
  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/30 hover:bg-muted/30 transition-none">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px] font-bold">Inspection ID</TableHead>
            <TableHead className="font-bold">Target Organization & Branch</TableHead>
            <TableHead className="font-bold">Inspector</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="text-right font-bold px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No inspections found matching &quot;{searchQuery}&quot;
              </TableCell>
            </TableRow>
          ) : (
            inspections.map((ins) => (
              <TableRow
                key={ins.id}
                className="hover:bg-muted/20 border-b border-muted/10 last:border-0 transition-colors"
              >
                <TableCell className="font-mono text-[11px] font-bold text-muted-foreground">{ins.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-primary/70" />
                      {ins.target}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-5">
                      <MapPin className="h-2.5 w-2.5" />
                      {ins.branch}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-[10px] text-rose-700 font-bold">
                      {ins.inspector
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-xs font-medium">{ins.inspector}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ins.status)}</TableCell>
                <TableCell className="text-[11px] font-bold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {ins.date}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-rose-50 hover:text-rose-600">
                    <Eye className="h-3.5 w-3.5" />
                    Report
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
