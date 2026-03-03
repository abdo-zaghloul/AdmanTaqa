import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, CheckCircle, XCircle, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import useStationJobOrderById from "@/hooks/Station/useStationJobOrderById";
import useStationJobOrderReports from "@/hooks/Station/useStationJobOrderReports";
import useApproveStationJobOrder from "@/hooks/Station/useApproveStationJobOrder";
import useRejectStationJobOrder from "@/hooks/Station/useRejectStationJobOrder";
import useApproveReport from "@/hooks/Station/useApproveReport";
import useRejectReport from "@/hooks/Station/useRejectReport";
import useUploadJobOrderReceipt from "@/hooks/Station/useUploadJobOrderReceipt";
import useConfirmPaymentSent from "@/hooks/Station/useConfirmPaymentSent";

export default function StationJobOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useStationJobOrderById(id ?? null);
  const { data: reports = [] } = useStationJobOrderReports(id ?? null);
  const approveOrderMutation = useApproveStationJobOrder();
  const rejectOrderMutation = useRejectStationJobOrder();
  const approveReportMutation = useApproveReport();
  const rejectReportMutation = useRejectReport();
  const uploadReceiptMutation = useUploadJobOrderReceipt();
  const confirmSentMutation = useConfirmPaymentSent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rejectReason, setRejectReason] = useState("");
  const [rejectReportReason, setRejectReportReason] = useState("");
  const [rejectReportId, setRejectReportId] = useState<number | null>(null);
  const [receiptFileUrl, setReceiptFileUrl] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER");

  const underReview = order?.status === "UNDER_REVIEW";
  const awaitingPayment = order?.status === "AWAITING_PAYMENT";
  const paymentRejected = order?.paymentRecord?.status === "REJECTED";
  const stationAlreadyConfirmedSent = order?.paymentRecord?.status === "STATION_CONFIRMED_SENT";
  const showPaymentSection =
    awaitingPayment && !paymentRejected && !stationAlreadyConfirmedSent;
  const canApproveOrRejectOrder = underReview;

  const handleApproveOrder = () => {
    if (!id) return;
    approveOrderMutation.mutate(id, {
      onSuccess: () => toast.success("Job order approved and closed."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Approve failed."),
    });
  };

  const handleRejectOrder = () => {
    if (!id || !rejectReason.trim()) {
      toast.error("Enter a reason for rework.");
      return;
    }
    rejectOrderMutation.mutate(
      { jobOrderId: id, body: { reason: rejectReason.trim() } },
      {
        onSuccess: () => {
          toast.success("Rework requested.");
          setRejectReason("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Reject failed."),
      }
    );
  };

  const handleApproveReport = (reportId: number) => {
    approveReportMutation.mutate(reportId, {
      onSuccess: () => toast.success("Report approved."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Failed."),
    });
  };

  const handleRejectReport = (reportId: number) => {
    if (!rejectReportReason.trim()) {
      toast.error("Enter a reason.");
      return;
    }
    rejectReportMutation.mutate(
      { reportId, body: { reason: rejectReportReason.trim() } },
      {
        onSuccess: () => {
          toast.success("Report rejected.");
          setRejectReportId(null);
          setRejectReportReason("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Failed."),
      }
    );
  };

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    uploadReceiptMutation.mutate(
      { jobOrderId: id, file },
      {
        onSuccess: (data) => {
          const url = (data as { receiptFileUrl?: string })?.receiptFileUrl;
          if (url) setReceiptFileUrl(url);
          toast.success("تم رفع الإيصال.");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "فشل رفع الإيصال."),
      }
    );
    e.target.value = "";
  };

  const handleConfirmSent = () => {
    if (!id) return;
    const body: { receiptFileUrl?: string; referenceNumber?: string; amount?: number; method?: string } = {};
    if (receiptFileUrl) body.receiptFileUrl = receiptFileUrl;
    if (referenceNumber.trim()) body.referenceNumber = referenceNumber.trim();
    const num = amount.trim() ? Number(amount) : undefined;
    if (num != null && !Number.isNaN(num)) body.amount = num;
    if (paymentMethod) body.method = paymentMethod;
    confirmSentMutation.mutate(
      { jobOrderId: id, body },
      {
        onSuccess: () => {
          toast.success("تم تأكيد إرسال المبلغ.");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "فشل التأكيد."),
      }
    );
  };

  if (isLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex justify-center min-h-[200px] items-center text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!order) {
    return (
      <div className="p-4 md:p-8">
        <Button variant="ghost" asChild>
          <Link to="/station-job-orders">Back</Link>
        </Button>
        <p className="text-destructive">Job order not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/station-job-orders" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {order.ExternalRequest?.formData?.title ??
              order.ServiceRequest?.formData?.title ??
              order.ServiceRequest?.formData?.description ??
              `Job Order #${order.id}`}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Status: <Badge variant="secondary">{order.status}</Badge>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {canApproveOrRejectOrder && (
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium">Review (approve close or request rework)</p>
              <div className="flex flex-wrap gap-2 items-end">
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={handleApproveOrder}
                  disabled={approveOrderMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" /> Approve & close
                </Button>
                <div className="flex gap-2 items-end">
                  <div className="space-y-1">
                    <Label htmlFor="reject-reason" className="text-xs">Rework reason</Label>
                    <Input
                      id="reject-reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rework"
                      className="w-[200px]"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={handleRejectOrder}
                    disabled={rejectOrderMutation.isPending || !rejectReason.trim()}
                  >
                    <XCircle className="h-4 w-4" /> Request rework
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {paymentRejected && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">المزود رفض استلام الدفع</CardTitle>
            {order.paymentRecord?.rejectionReason && (
              <p className="text-sm text-muted-foreground">{order.paymentRecord.rejectionReason}</p>
            )}
          </CardHeader>
        </Card>
      )}

      {awaitingPayment && stationAlreadyConfirmedSent && (
        <Card className="border-muted bg-muted/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              Payment sent. Waiting for provider to confirm receipt.
            </p>
          </CardContent>
        </Card>
      )}

      {showPaymentSection && (
        <Card>
          <CardHeader>
            <CardTitle>الدفع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 items-end">
              <input
                type="file"
                accept=".pdf,image/*"
                ref={fileInputRef}
                onChange={handleUploadReceipt}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadReceiptMutation.isPending}
              >
                <Upload className="h-4 w-4" /> رفع إيصال
              </Button>
              {receiptFileUrl && (
                <span className="text-sm text-muted-foreground">تم رفع الإيصال</span>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">رقم التحويل (اختياري)</Label>
                <Input
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="رقم التحويل"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">المبلغ (اختياري)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="المبلغ"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">طريقة الدفع</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">تحويل بنكي</SelectItem>
                    <SelectItem value="CASH">نقدي</SelectItem>
                    <SelectItem value="OTHER">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleConfirmSent}
              disabled={confirmSentMutation.isPending}
            >
              تأكيد إرسال المبلغ
            </Button>
          </CardContent>
        </Card>
      )}

      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Maintenance reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <span className="font-medium">{r.title ?? `Report #${r.id}`}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{r.status}</Badge>
                    {r.createdAt && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproveReport(r.id)}
                      disabled={approveReportMutation.isPending}
                    >
                      Approve
                    </Button>
                    {rejectReportId === r.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={rejectReportReason}
                          onChange={(e) => setRejectReportReason(e.target.value)}
                          placeholder="Reason"
                          className="w-32 h-8"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectReport(r.id)}
                          disabled={rejectReportMutation.isPending || !rejectReportReason.trim()}
                        >
                          Reject
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectReportId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => setRejectReportId(r.id)}>
                        Reject
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
