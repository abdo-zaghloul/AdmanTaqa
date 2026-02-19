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
import { Search, Filter, Eye } from "lucide-react";
import type { OrganizationProfile } from "@/types/organization";
import OrganizationActions from "./OrganizationActions";

export type OrganizationRow = OrganizationProfile;

type TableOrganizationProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  organizations: OrganizationRow[];
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

export default function TableOrganization({
  searchQuery,
  onSearchChange,
  organizations,
}: TableOrganizationProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              className="pl-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              <Filter className="h-4 w-4 inline-block mr-2" />
              {organizations.length} Organizations
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 divide-y">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] font-bold text-foreground">ID</TableHead>
                <TableHead className="font-bold text-foreground">Organization</TableHead>
                <TableHead className="font-bold text-foreground">Type</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground">Created At</TableHead>
                <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <TableRow key={org.id} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                    <TableCell className="font-mono text-xs font-semibold text-primary/80">{org.id}</TableCell>
                    <TableCell>
                      <span className="font-bold text-sm">{org.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-primary/20 bg-primary/5 text-primary/80">
                        {org.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={org.status} />
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
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                          onClick={() => navigate(`/organizations/${org.id}`)}
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
                      <p className="text-sm">No organizations found matching your search.</p>
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
