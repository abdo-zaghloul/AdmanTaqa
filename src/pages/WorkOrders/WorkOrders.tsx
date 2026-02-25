import { useState } from "react";
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

export default function WorkOrders() {
  const { hasPermission } = useAuth();
  const [status, setStatus] = useState<WorkOrderStatus | "all">("all");
  const [priority, setPriority] = useState<WorkOrderPriority | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, error } = useGetWorkOrders({
    status,
    priority,
    page,
    limit,
  });

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <Select
                value={status}
                onValueChange={(value: WorkOrderStatus | "all") => {
                  setStatus(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                  <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
                  <SelectItem value="CLOSED">CLOSED</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>
          <p className="text-xs text-muted-foreground">
            Total: {data?.total ?? 0} | Page: {data?.page ?? page}
          </p>
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
