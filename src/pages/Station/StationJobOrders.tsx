import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStationJobOrders from "@/hooks/Station/useStationJobOrders";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "كل الحالات" },
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
          <h1 className="text-3xl font-bold tracking-tight">أوامر العمل</h1>
          <p className="text-muted-foreground">
            أوامر العمل الخارجية المرتبطة بطلبات المحطة (Work Order من المحطة لمزود الخدمة).
          </p>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">التصفية بحالة:</span>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[200px] h-8 text-xs">
                <SelectValue placeholder="كل الحالات" />
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
        {isLoading ? (
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد أوامر عمل.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((jo) => (
              <li key={jo.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {jo.ServiceRequest?.formData?.description ?? `Job Order #${jo.id}`}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {jo.status ?? "—"}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/station-job-orders/${jo.id}`}>عرض</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
        {total > limit && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
