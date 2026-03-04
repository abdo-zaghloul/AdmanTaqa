import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetWorkOrders from "@/hooks/WorkOrders/useGetWorkOrders";
import { useAuth } from "@/context/AuthContext";
import type { WorkOrderPriority, WorkOrderStatus } from "@/types/workOrder";
import WorkOrdersTable from "./components/WorkOrdersTable";
import CreateWorkOrderDialog from "./components/CreateWorkOrderDialog";

const STATUS_TABS: { label: string; status: WorkOrderStatus }[] = [
  { label: "New", status: "PENDING" },
  { label: "In progress", status: "IN_PROGRESS" },
  { label: "Under review", status: "UNDER_REVIEW" },
  { label: "Closed", status: "CLOSED" },
];

export default function WorkOrders() {
  const { hasPermission } = useAuth();
  const hasApprove = hasPermission("workorders.approve");
  const [status, setStatus] = useState<WorkOrderStatus>("PENDING");
  const [priority, setPriority] = useState<WorkOrderPriority | "all">("all");
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState<Partial<Record<WorkOrderStatus, number>>>({});
  const limit = 20;

  const tabs = STATUS_TABS.filter((tab) => tab.status !== "UNDER_REVIEW" || hasApprove);

  const { data, isLoading, isError, error } = useGetWorkOrders({
    status,
    priority,
    page,
    limit,
  });

  useEffect(() => {
    if (data?.total != null) {
      setCounts((prev) => ({ ...prev, [status]: data.total }));
    }
  }, [data?.total, status]);

  const items = data?.items ?? [];
  const maxPage = Math.max(1, Math.ceil((data?.total ?? 0) / Math.max(limit, 1)));

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage internal maintenance work orders and their lifecycle.
          </p>
        </div>
        {hasPermission("workorders.create") ? <CreateWorkOrderDialog /> : null}
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md p-4 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 border-b pb-2">
            {tabs.map(({ label, status: tabStatus }) => {
              const count = counts[tabStatus];
              const labelWithCount = count !== undefined ? `${label} (${count})` : `${label} (—)`;
              return (
                <Button
                  key={tabStatus}
                  variant={status === tabStatus ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setStatus(tabStatus);
                    setPage(1);
                  }}
                >
                  {labelWithCount}
                </Button>
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Priority</p>
              <Select
                value={priority}
                onValueChange={(value: WorkOrderPriority | "all") => {
                  setPriority(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {data?.total ?? 0} | Page: {data?.page ?? page}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading work orders...</div>
        ) : isError ? (
          <div className="p-6 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load work orders."}
          </div>
        ) : (
          <WorkOrdersTable items={items} />
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
  );
}
