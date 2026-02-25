import { useState, useMemo } from "react";
import TableOrganization from "./Component/TableOrganization";
import useGetOrganizations from "@/hooks/Organization/useGetOrganizations";

export default function Organizations() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, error } = useGetOrganizations({ page: 1, limit: 20 });

  const filteredOrgs = useMemo(() => {
    const list = (data?.data?.items ?? []).filter(
      (org) => org.status === "PENDING" || org.status === "REJECTED"
    );
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (org) =>
        org.name.toLowerCase().includes(q) ||
        String(org.id).toLowerCase().includes(q)
    );
  }, [data?.data?.items, searchQuery]);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage and monitor all service providers and fuel stations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading organizations...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
          {(error as Error)?.message ?? "Failed to load organizations."}
        </div>
      ) : (
        <TableOrganization
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          organizations={filteredOrgs}
        />
      )}
    </div>
  );
}
