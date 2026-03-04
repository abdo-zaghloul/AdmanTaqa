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
import { getApiErrorMessage } from "@/lib/utils";

const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

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
    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      toast.error("File size too large. Maximum size is 5MB.");
      e.target.value = "";
      return;
    }
    uploadReceiptMutation.mutate(
      { jobOrderId: id, file },
      {
        onSuccess: (data) => {
          const url = (data as { receiptFileUrl?: string })?.receiptFileUrl;
          if (url) {
            setReceiptFileUrl(url);
            confirmSentMutation.mutate(
              { jobOrderId: id, body: { receiptFileUrl: url } },
              {
                onSuccess: () => toast.success("Receipt uploaded and payment confirmed."),
                onError: (err) => toast.error(getApiErrorMessage(err, "Confirm failed.")),
              }
            );
          } else {
            toast.success("Receipt uploaded.");
          }
        },
        onError: (err) => toast.error(getApiErrorMessage(err, "Upload failed.")),
      }
    );
    e.target.value = "";
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
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ارفع إيصال التحويل لتأكيد إرسال المبلغ. المزود سيتلقى التأكيد ويستطيع بدء أمر العمل.
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              ref={fileInputRef}
              onChange={handleUploadReceipt}
              className="hidden"
            />
            <Button
              type="button"
              size="sm"
              className="gap-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadReceiptMutation.isPending || confirmSentMutation.isPending}
            >
              <Upload className="h-4 w-4" /> رفع إيصال وتأكيد الدفع
            </Button>
            {receiptFileUrl && (
              <span className="text-sm text-muted-foreground">تم رفع الإيصال</span>
            )}
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
