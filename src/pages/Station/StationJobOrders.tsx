import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStationJobOrders from "@/hooks/Station/useStationJobOrders";
import type { StationJobOrderListItem } from "@/types/station";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "AWAITING_PAYMENT", label: "AWAITING_PAYMENT" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "IN_PROGRESS", label: "IN_PROGRESS" },
  { value: "WAITING_PARTS", label: "WAITING_PARTS" },
  { value: "UNDER_REVIEW", label: "UNDER_REVIEW" },
  { value: "REWORK_REQUIRED", label: "REWORK_REQUIRED" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "CLOSED", label: "CLOSED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

function jobOrderTitle(jo: StationJobOrderListItem): string {
  return (
    jo.ExternalRequest?.formData?.title ??
    jo.ServiceRequest?.formData?.title ??
    jo.ServiceRequest?.formData?.description ??
    `Job Order #${jo.id}`
  );
}

function jobOrderBranch(jo: StationJobOrderListItem): string {
  const branch = jo.ExternalRequest?.Branch;
  return branch?.nameEn ?? branch?.nameAr ?? (jo.ExternalRequest?.branchId != null ? `Branch ${jo.ExternalRequest.branchId}` : "—");
}

function jobOrderProvider(jo: StationJobOrderListItem): string {
  return jo.ProviderQuote?.Organization?.name ?? "—";
}

export default function StationJobOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const limit = 20;
  const { data, isLoading } = useStationJobOrders({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Station Job Orders</h1>
          <p className="text-muted-foreground">
            External job orders (data: items, total, page, limit).
          </p>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status</span>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-muted-foreground">{total} total</span>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No job orders.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((jo) => (
                <TableRow key={jo.id}>
                  <TableCell className="font-mono">{jo.id}</TableCell>
                  <TableCell className="font-medium">{jobOrderTitle(jo)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{jo.status ?? "—"}</Badge>
                  </TableCell>
                  <TableCell>{jobOrderBranch(jo)}</TableCell>
                  <TableCell>{jobOrderProvider(jo)}</TableCell>
                  <TableCell>
                    {jo.createdAt
                      ? new Date(jo.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/station-job-orders/${jo.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {total > limit && (
          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
