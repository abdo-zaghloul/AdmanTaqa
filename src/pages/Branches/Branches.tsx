import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";
import BranchesTableHeader from "./Component/BranchesTableHeader";
import TableBranches from "./Component/TableBranches";
import useGetBranches from "@/hooks/Branches/useGetBranches";
import type { BranchApiItem } from "@/hooks/Branches/useGetBranches";

function BranchesLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="text-sm font-medium">Loading branches...</p>
    </div>
  );
}

function BranchesError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-destructive">
      <AlertCircle className="h-10 w-10" />
      <p className="text-sm font-medium text-center max-w-md">{message}</p>
    </div>
  );
}

export default function Branches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: branches = [], isLoading, isError, error } = useGetBranches();

  const filteredBranches = useMemo(() => {
    return branches.filter((branch: BranchApiItem) => {
      const name = (branch.nameEn || branch.nameAr || "").toLowerCase();
      const idStr = String(branch.id);
      const areaName = (branch.Area?.name ?? "").toLowerCase();
      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        idStr.includes(searchQuery) ||
        areaName.includes(searchQuery.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "ACTIVE" && branch.status === "APPROVED" && branch.isActive) ||
        (statusFilter === "INACTIVE" && (!branch.isActive || branch.status !== "APPROVED"));
      return matchesSearch && statusMatch;
    });
  }, [branches, searchQuery, statusFilter]);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground">
            Manage your organization's branch network and locations.
          </p>
        </div>
        <Button asChild className="gap-2 shadow-sm bg-primary hover:bg-primary/90">
          <Link to="/branches/create">
            <Plus className="h-4 w-4" />
            Add New Branch
          </Link>
        </Button>
      </div>

      {isLoading && <BranchesLoading />}
      {isError && (
        <BranchesError
          message={getApiErrorMessage(error, "Failed to load branches.")}
        />
      )}
      {!isLoading && !isError && (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <BranchesTableHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <TableBranches branches={filteredBranches} />
        </Card>
      )}
    </div>
  );
}
