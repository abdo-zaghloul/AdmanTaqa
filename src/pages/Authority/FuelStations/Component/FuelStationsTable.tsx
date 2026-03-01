import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Eye } from "lucide-react";
import type { OrganizationProfile } from "@/types/organization";
import OrganizationActions from "../../Organizations/Component/OrganizationActions";

type FuelStationsTableProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  stations: OrganizationProfile[];
};

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED")
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
        Approved
      </Badge>
    );
  if (status === "PENDING")
    return (
      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
        Pending
      </Badge>
    );
  if (status === "REJECTED")
    return (
      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 text-xs">
        Rejected
      </Badge>
    );
  return <Badge variant="outline">{status}</Badge>;
}

export default function FuelStationsTable({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stations,
}: FuelStationsTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              className="pl-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[140px] h-9 bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm font-medium text-muted-foreground whitespace-nowrap flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {stations.length} stations
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 divide-y">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[70px] font-bold text-foreground">ID</TableHead>
                <TableHead className="font-bold text-foreground">Name</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground max-w-[200px]">Rejection Reason</TableHead>
                <TableHead className="font-bold text-foreground">Created</TableHead>
                <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.length > 0 ? (
                stations.map((org) => (
                  <TableRow
                    key={org.id}
                    className="hover:bg-muted/20 transition-colors border-b last:border-0"
                  >
                    <TableCell className="font-mono text-xs font-semibold text-primary/80">
                      {org.id}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">{org.name}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={org.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate" title={org.rejectionReason ?? undefined}>
                      {org.status === "REJECTED" && org.rejectionReason
                        ? org.rejectionReason
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">
                      {new Date(org.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <OrganizationActions
                          orgId={org.id}
                          orgName={org.name}
                          status={org.status}
                          variant="compact"
                          onSuccess={() => {}}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                          onClick={() => navigate(`/fuel-stations/${org.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                      <Search className="h-8 w-8" />
                      <p className="text-sm">No fuel stations found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
