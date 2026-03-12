import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import useAuthorityExternalJobOrders from "@/hooks/AuthorityExternalJobOrders/useAuthorityExternalJobOrders";
import { fetchAuthorityExternalJobOrderExport } from "@/api/services/authorityExternalJobOrderService";
import type {
  AuthorityExternalJobOrderItem,
  AuthorityExternalJobOrdersListParams,
  DatePreset,
} from "@/types/authorityExternalJobOrder";

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "custom", label: "Custom" },
];

const LIMIT = 20;

function getStatusBadgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (["COMPLETED", "DONE", "CLOSED"].includes(status)) return "secondary";
  if (["ACTIVE", "IN_PROGRESS"].includes(status)) return "default";
  if (["REJECTED", "CANCELLED"].includes(status)) return "destructive";
  return "outline";
}

export default function AuthorityExternalJobOrders() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [branchId, setBranchId] = useState("");
  const [fuelStationOrganizationId, setFuelStationOrganizationId] = useState("");
  const [exportLoading, setExportLoading] = useState<"csv" | "json" | null>(null);

  const listParams: AuthorityExternalJobOrdersListParams = {
    page,
    limit: LIMIT,
    ...(status.trim() ? { status: status.trim() } : {}),
    ...(datePreset ? { datePreset: datePreset as DatePreset } : {}),
    ...(datePreset === "custom" && fromDate ? { fromDate } : {}),
    ...(datePreset === "custom" && toDate ? { toDate } : {}),
    ...(branchId.trim() ? { branchId: branchId.trim() } : {}),
    ...(fuelStationOrganizationId.trim() ? { fuelStationOrganizationId: fuelStationOrganizationId.trim() } : {}),
  };

  const { data, isLoading, isError, error } = useAuthorityExternalJobOrders(listParams);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const maxPage = Math.max(1, Math.ceil(total / LIMIT));

  const handleExport = useCallback(async (format: "csv" | "json") => {
    setExportLoading(format);
    try {
      await fetchAuthorityExternalJobOrderExport({
        status: status.trim() || undefined,
        datePreset: datePreset || undefined,
        fromDate: datePreset === "custom" ? fromDate || undefined : undefined,
        toDate: datePreset === "custom" ? toDate || undefined : undefined,
        branchId: branchId.trim() || undefined,
        fuelStationOrganizationId: fuelStationOrganizationId.trim() || undefined,
        format,
      });
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportLoading(null);
    }
  }, [
    status,
    datePreset,
    fromDate,
    toDate,
    branchId,
    fuelStationOrganizationId,
  ]);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">External Job Orders</h1>
          <p className="text-muted-foreground">
            Authority view of external maintenance job orders. No financial data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={exportLoading !== null}
            onClick={() => handleExport("csv")}
          >
            {exportLoading === "csv" ? "Exporting…" : "Export CSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={exportLoading !== null}
            onClick={() => handleExport("json")}
          >
            {exportLoading === "json" ? "Exporting…" : "Export JSON"}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Status (comma-separated)</label>
            <Input
              placeholder="e.g. ACTIVE,IN_PROGRESS"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Date preset</label>
            <Select
              value={datePreset || "all"}
              onValueChange={(v) => {
                setDatePreset(v === "all" ? "" : (v as DatePreset));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {DATE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {datePreset === "custom" && (
            <>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">From date</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setPage(1);
                  }}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">To date</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setPage(1);
                  }}
                  className="h-9"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Branch ID</label>
            <Input
              type="number"
              placeholder="Optional"
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setPage(1);
              }}
              className="h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Fuel station org ID</label>
            <Input
              type="number"
              placeholder="Optional"
              value={fuelStationOrganizationId}
              onChange={(e) => {
                setFuelStationOrganizationId(e.target.value);
                setPage(1);
              }}
              className="h-9"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Total: {total} | Page: {data?.page ?? page}
        </p>

        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading job orders…</div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive text-sm">
            {error instanceof Error ? error.message : "Failed to load job orders."}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No job orders found.</div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground">Created</TableHead>
                <TableHead className="font-bold text-foreground">Title</TableHead>
                <TableHead className="font-bold text-foreground">Branch</TableHead>
                <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row: AuthorityExternalJobOrderItem) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(row.status ?? "")}>
                      {row.status ?? "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }) : "—"}
                  </TableCell>
                  <TableCell>
                    {row.ExternalRequest?.formData?.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    {row.ExternalRequest?.Branch?.nameEn ?? row.ExternalRequest?.Branch?.nameAr ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/external-job-orders/${row.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {maxPage}
          </span>
          <Button
            variant="outline"
            size="sm"
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
