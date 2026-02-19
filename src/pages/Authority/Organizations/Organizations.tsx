import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import TableOrganization from "./Component/TableOrganization";
import useGetOrganizations from "@/hooks/Organization/useGetOrganizations";
import useApproveOrganization from "@/hooks/Organization/useApproveOrganization";

export default function Organizations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, error } = useGetOrganizations({ page: 1, limit: 20 });
  const approveMutation = useApproveOrganization();
  const filteredOrgs = useMemo(() => {
    const list = data?.data?.items ?? [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (org) =>
        org.name.toLowerCase().includes(q) ||
        String(org.id).toLowerCase().includes(q)
    );
  }, [data?.data?.items, searchQuery]);
// console.log(error);

  const handleApprove = (id: number | string) => {
    approveMutation.mutate(
      { id, body: { decision: "APPROVED" } },
      {
        onSuccess: () => toast.success("Organization approved."),
        onError: (e) => toast.error((e as Error)?.message ?? "Failed to approve."),
      }
    );
  };

  const handleReject = (id: number | string, reason?: string) => {
    approveMutation.mutate(
      { id, body: { decision: "REJECTED", reason } },
      {
        onSuccess: () => toast.success("Organization rejected."),
        onError: (e) => toast.error((e as Error)?.message ?? "Failed to reject."),
      }
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage and monitor all service providers and fuel stations.
          </p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => navigate("/organizations/register")}>
          <Plus className="h-4 w-4" />
          Register Organization
        </Button>
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
          onApprove={handleApprove}
          onReject={handleReject}
          approveMutation={approveMutation}
        />
      )}
    </div>
  );
}
