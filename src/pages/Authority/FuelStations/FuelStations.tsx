import { useState, useMemo } from "react";
import useGetFuelStations from "@/hooks/Organization/useGetFuelStations";
import FuelStationsTable from "./Component/FuelStationsTable";

export default function FuelStations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError, error } = useGetFuelStations({
    status: statusFilter === "all" ? undefined : (statusFilter as "PENDING" | "APPROVED" | "REJECTED"),
    page,
    limit,
  });

  const items = data?.data?.items ?? [];
  const filteredStations = useMemo(() => {
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
          <h1 className="text-3xl font-bold tracking-tight">Fuel Stations</h1>
          <p className="text-muted-foreground">
            View and approve or reject fuel station registrations (Authority).
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          Loading fuel stations...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
          {(error as Error)?.message ?? "Failed to load fuel stations."}
        </div>
      ) : (
        <FuelStationsTable
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          stations={filteredStations}
        />
      )}
    </div>
  );
}
