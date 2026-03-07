import { useState, useMemo } from "react";
import TableOrganization from "./Component/TableOrganization";
import useGetOrganizations from "@/hooks/Organization/useGetOrganizations";

export default function OrganizationsRejected() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, error } = useGetOrganizations({
    page: 1,
    limit: 100,
    type: "SERVICE_PROVIDER",
    status: "REJECTED",
  });

  const items = data?.data?.items ?? [];
  const filteredOrgs = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (org) =>
        org.name.toLowerCase().includes(q) ||
        String(org.id).toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations — Rejected</h1>
          <p className="text-muted-foreground">
            Service providers that were rejected.
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
