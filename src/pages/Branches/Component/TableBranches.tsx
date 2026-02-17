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
import { MapPin, Eye, CheckCircle2, XCircle } from "lucide-react";
import type { BranchApiItem } from "@/hooks/Branches/useGetBranches";

type TableBranchesProps = {
  branches: BranchApiItem[];
};

function getStatusBadge(status: string, isActive: boolean) {
  if (status === "APPROVED" && isActive) {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 hover:bg-emerald-50 shadow-sm font-medium">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-50 text-slate-700 border-slate-200 gap-1 hover:bg-slate-50 shadow-sm font-medium">
      <XCircle className="h-3 w-3" />
      {status}
    </Badge>
  );
}

export default function TableBranches({ branches }: TableBranchesProps) {
  const navigate = useNavigate();

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[80px] font-bold text-foreground">ID</TableHead>
              <TableHead className="font-bold text-foreground">Name</TableHead>
              <TableHead className="font-bold text-foreground">Location</TableHead>
              <TableHead className="font-bold text-foreground">Station Type</TableHead>
              <TableHead className="font-bold text-foreground">Fuel Types</TableHead>
              <TableHead className="font-bold text-foreground">Status</TableHead>
              <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.length > 0 ? (
              branches.map((branch) => (
                <TableRow
                  key={branch.id}
                  className="hover:bg-muted/20 transition-all border-b last:border-0 border-muted/20"
                >
                  <TableCell className="font-mono text-xs font-bold text-primary/70">{branch.id}</TableCell>
                  <TableCell className="font-semibold text-sm">
                    {branch.nameEn || branch.nameAr || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm">
                        {branch.Area?.name ?? "—"}
                        {branch.address ? `, ${branch.address}` : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {branch.FuelStationType ? (
                      <span>{branch.FuelStationType.name}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(branch.FuelTypes ?? []).length > 0 ? (
                        (branch.FuelTypes ?? []).map((ft) => (
                          <Badge key={ft.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {ft.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(branch.status, branch.isActive)}</TableCell>
                  <TableCell className="text-right px-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 hover:bg-primary/5 hover:text-primary transition-all rounded-md"
                      onClick={() => navigate(`/branches/${branch.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                    <MapPin className="h-10 w-10" />
                    <p className="font-medium">No branches found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
}
