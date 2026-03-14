import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJobOrdersWebList } from "@/hooks/Provider/useJobOrdersWeb";
import { Eye } from "lucide-react";
import type { ProviderJobOrderItem } from "@/types/provider";

/** Status filter options per job-orders-web API (CREATED, AWAITING_PAYMENT, ACTIVE, ...). */
const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "CREATED", label: "CREATED" },
  { value: "AWAITING_PAYMENT", label: "AWAITING_PAYMENT (confirm payment received here)" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "IN_PROGRESS", label: "IN_PROGRESS" },
  { value: "WAITING_PARTS", label: "WAITING_PARTS" },
  { value: "UNDER_REVIEW", label: "UNDER_REVIEW" },
  { value: "REWORK_REQUIRED", label: "REWORK_REQUIRED" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "CANCELLED", label: "CANCELLED" },
  { value: "CLOSED", label: "CLOSED" },
  { value: "SUSPENDED", label: "SUSPENDED" },
];

export default function ProviderJobOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const limit = 20;
  const { data, isLoading } = useJobOrdersWebList({
    page,
    limit,
    ...(statusFilter && { status: statusFilter }),
  });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = total > 0 && limit > 0 ? Math.ceil(total / limit) : 1;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Job Orders</h1>
        <p className="text-muted-foreground">External job orders assigned to your organization.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Status filter:</span>
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => {
            setStatusFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        {isLoading ? (
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </CardContent>
        ) : items.length === 0 ? (
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">No job orders.</p>
              <p className="text-xs text-muted-foreground">
                Job orders appear here when the station selects your quote and confirms payment. Make sure you are logged in with the <strong>service provider organization</strong> that owns the selected quote, not the station account.
              </p>
              {statusFilter === "AWAITING_PAYMENT" && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  No job orders currently awaiting payment confirmation. AWAITING_PAYMENT orders appear when the station selects your quote and confirms payment — then open &quot;View&quot; to find the &quot;Confirm payment received&quot; block.
                </p>
              )}
            </div>
          </CardContent>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="font-bold">Priority</TableHead>
                    <TableHead className="font-bold max-w-[280px]">Description</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((jo: ProviderJobOrderItem) => {
                    const formData = jo.externalRequest?.formData ?? {};
                    const title = formData.title?.trim() || "—";
                    const priority = formData.priority?.trim() || "—";
                    const description = formData.description?.trim() || "—";
                    return (
                      <TableRow key={jo.id} className="hover:bg-muted/20">
                        <TableCell>
                          <Badge variant={jo.status === "COMPLETED" ? "default" : "secondary"} className="text-xs">
                            {jo.status ?? "—"}
                          </Badge>
                        </TableCell>
                        <TableCell>{title}</TableCell>
                        <TableCell>
                          {priority === "—" ? "—" : <Badge variant="outline" className="text-xs">{priority}</Badge>}
                        </TableCell>
                        <TableCell className="max-w-[280px] truncate text-muted-foreground" title={description === "—" ? undefined : description}>
                          {description}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/provider-job-orders/${jo.id}`} className="gap-1.5">
                              <Eye className="h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {items.length > 0 && !statusFilter && (
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground border-t pt-3">
                  To find an order in <strong>AWAITING_PAYMENT</strong> (payment confirmation): use the &quot;AWAITING_PAYMENT&quot; filter or open View on the order to see the confirm payment received section on the detail page.
                </p>
              </CardContent>
            )}
            {totalPages > 1 && (
              <CardContent className="pt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </CardContent>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
