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
import useProviderJobOrders from "@/hooks/Provider/useProviderJobOrders";
import { Eye } from "lucide-react";

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
                تظهر هنا أوامر العمل عندما تختار المحطة عرضك (Select quote) ثم تؤكد إرسال المبلغ. تأكد أنك مسجّل الدخول بحساب <strong>منظمة المزود</strong> صاحبة العرض المختار وليس بحساب المحطة.
              </p>
              {statusFilter === "AWAITING_PAYMENT" && (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  لا يوجد حالياً أوامر بانتظار تأكيد استلام الدفع. تظهر أوامر AWAITING_PAYMENT عندما تختار المحطة عرضك وتؤكد إرسال المبلغ — عندها ادخل من &quot;View&quot; وستجد بلوك &quot;تأكيد استلام الدفع عند المزود&quot;.
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
                    <TableHead className="font-bold">Job Order</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">Title</TableHead>
                    <TableHead className="font-bold">Priority</TableHead>
                    <TableHead className="font-bold max-w-[280px]">Description</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((jo) => {
                    const formData = jo.externalRequest?.formData ?? {};
                    const title = formData.title?.trim() || "—";
                    const priority = formData.priority?.trim() || "—";
                    const description = formData.description?.trim() || "—";
                    return (
                      <TableRow key={jo.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">#{jo.id}</TableCell>
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
                  للعثور على أمر في حالة <strong>AWAITING_PAYMENT</strong> (تأكيد استلام الدفع): اختر الفلتر &quot;AWAITING_PAYMENT&quot; أو ادخل من View على الأمر وستجد تأكيد استلام الدفع في صفحة التفاصيل.
                </p>
              </CardContent>
            )}
            {total > limit && (
              <CardContent className="pt-0 flex gap-2">
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
              </CardContent>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
