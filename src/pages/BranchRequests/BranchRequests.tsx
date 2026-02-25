import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import PendingApprovalGuard from "@/components/PendingApprovalGuard";
import useGetBranchRequests from "@/hooks/BranchRequests/useGetBranchRequests";
import type { BranchRequestStatus } from "@/types/branchRequest";
import BranchRequestsTable from "./Component/BranchRequestsTable";

export default function BranchRequests() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<BranchRequestStatus | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: orgResponse, isLoading: orgLoading } = useGetOrganization();
  const organization = orgResponse?.data;
  const isAuthority = organization?.type === "AUTHORITY";
  const isFuelStation = organization?.type === "FUEL_STATION";

  const { data, isLoading, isError, error } = useGetBranchRequests({
    status,
    page,
    limit,
  });

  const items = data?.items ?? [];
  const maxPage = Math.max(1, Math.ceil((data?.total ?? 0) / Math.max(limit, 1)));

  return (
    <PendingApprovalGuard organization={organization} isLoading={orgLoading}>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Branch Requests</h1>
            <p className="text-muted-foreground">
              Track and review branch onboarding requests.
            </p>
          </div>
          {isFuelStation && (
            <Button onClick={() => navigate("/branch-requests/create")}>
              Submit Branch Request
            </Button>
          )}
        </div>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Select
                value={status}
                onValueChange={(value: BranchRequestStatus | "all") => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {data?.total ?? 0} | Page: {data?.page ?? page}
            </p>
          </div>

          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading requests...</div>
          ) : isError ? (
            <div className="p-6 text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to load requests."}
            </div>
          ) : (
            <BranchRequestsTable items={items} isAuthority={isAuthority} />
          )}

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => (p < maxPage ? p + 1 : p))}
              disabled={page >= maxPage}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </PendingApprovalGuard>
  );
}
