import { useMemo, useState } from "react";
import TableOrganization from "@/pages/Authority/Organizations/Component/TableOrganization";
import useGetOrganizations from "@/hooks/Organization/useGetOrganizations";

export default function RegistrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, error } = useGetOrganizations({
    status: "APPROVED",
    page: 1,
    limit: 20,
  });

  const filteredOrgs = useMemo(() => {
    const list = (data?.data?.items ?? []).filter((org) => org.status === "APPROVED");
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approved Registrations</h1>
        <p className="text-muted-foreground">
          View approved organizations with the same structure as Organizations.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading approved registrations...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
          {(error as Error)?.message ?? "Failed to load approved registrations."}
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
