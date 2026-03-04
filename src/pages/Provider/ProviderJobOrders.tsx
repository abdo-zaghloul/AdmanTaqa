import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useProviderJobOrders from "@/hooks/Provider/useProviderJobOrders";

const STATUS_OPTIONS = [
  { value: "", label: "كل الحالات" },
  { value: "AWAITING_PAYMENT", label: "AWAITING_PAYMENT (تأكيد استلام الدفع من هنا)" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "IN_PROGRESS", label: "IN_PROGRESS" },
  { value: "UNDER_REVIEW", label: "UNDER_REVIEW" },
  { value: "CLOSED", label: "CLOSED" },
  { value: "COMPLETED", label: "COMPLETED" },
];

export default function ProviderJobOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const limit = 20;
  const { data, isLoading } = useProviderJobOrders({
    page,
    limit,
    ...(statusFilter && { status: statusFilter }),
  });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Job Orders</h1>
        <p className="text-muted-foreground">External job orders assigned to your organization.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">فلتر الحالة:</span>
        <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value || "all"} value={opt.value || "all"}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">No job orders.</p>
            <p className="text-xs text-muted-foreground">
              تظهر هنا أوامر العمل عندما تختار المحطة عرضك (Select quote) ثم تؤكد إرسال المبلغ. تأكد أنك مسجّل الدخول بحساب <strong>منظمة المزود</strong> صاحبة العرض المختار وليس بحساب المحطة.
            </p>
            {statusFilter === "AWAITING_PAYMENT" && (
              <p className="text-xs text-amber-700 dark:text-amber-300">
                لا يوجد حالياً أوامر بانتظار تأكيد استلام الدفع. تظهر أوامر AWAITING_PAYMENT عندما تختار المحطة عرضك وتؤكد إرسال المبلغ — عندها ادخل من &quot;View&quot; وستجد بلوك &quot;تأكيد استلام الدفع عند المزود&quot;.
              </p>
            )}
          </div>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((jo) => (
                <li key={jo.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <span className="font-medium">Job Order #{jo.id}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{jo.status}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/provider-job-orders/${jo.id}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
            {items.length > 0 && !statusFilter && (
              <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                للعثور على أمر في حالة <strong>AWAITING_PAYMENT</strong> (تأكيد استلام الدفع): اختر الفلتر &quot;AWAITING_PAYMENT&quot; أو ادخل من View على الأمر وستجد تأكيد استلام الدفع في صفحة التفاصيل.
              </p>
            )}
            {total > limit && (
              <div className="flex gap-2 pt-2">
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
          </>
        )}
      </Card>
    </div>
  );
}
