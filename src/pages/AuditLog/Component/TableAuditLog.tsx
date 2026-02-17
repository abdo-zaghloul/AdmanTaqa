import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, Database } from "lucide-react";

export type AuditLogRow = {
  id: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  details: string;
};

type TableAuditLogProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  logs: AuditLogRow[];
};

function getActionBadge(action: string) {
  const isCritical = action.includes("APPROVE") || action.includes("REJECT") || action.includes("SUBMIT");
  const isWarning = action.includes("FAILED");
  return (
    <Badge
      variant={isCritical ? "default" : "outline"}
      className={`text-[10px] font-bold tracking-tight rounded-md py-0 ${
        isWarning ? "bg-red-100 text-red-700 border-red-200" : !isCritical ? "bg-muted/50" : ""
      }`}
    >
      {action.replace("_", " ")}
    </Badge>
  );
}

export default function TableAuditLog({ searchQuery, onSearchChange, logs }: TableAuditLogProps) {
  return (
    <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b bg-slate-50/30">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or resource ID..."
                className="pl-10 bg-background/50 border-muted-foreground/10"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px] font-bold text-foreground">Timestamp</TableHead>
                <TableHead className="w-[150px] font-bold text-foreground">User</TableHead>
                <TableHead className="w-[200px] font-bold text-foreground">Action</TableHead>
                <TableHead className="font-bold text-foreground">Resource / Target</TableHead>
                <TableHead className="font-bold text-foreground">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No audit logs found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-muted/10 border-b border-muted/5 last:border-0 transition-colors"
                  >
                    <TableCell className="text-[11px] font-bold text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="font-mono text-primary/70">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-semibold">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter flex items-center gap-1">
                          <Database className="h-2.5 w-2.5" />
                          {log.resource}
                        </span>
                        <span className="text-xs font-mono font-bold text-primary/80">{log.resourceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-slate-600 max-w-md line-clamp-2 italic font-medium">
                        &quot;{log.details}&quot;
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
