import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, AlertCircle, Building2, MapPin, Phone, Calendar, XCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import useStationRequestById from "@/hooks/Station/useStationRequestById";
import useSelectQuote from "@/hooks/Station/useSelectQuote";
import useRejectQuote from "@/hooks/Station/useRejectQuote";
import useConfirmPaymentSent from "@/hooks/Station/useConfirmPaymentSent";
import useUploadJobOrderReceipt from "@/hooks/Station/useUploadJobOrderReceipt";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StationRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading } = useStationRequestById(id ?? null);
  const selectQuoteMutation = useSelectQuote();
  const rejectQuoteMutation = useRejectQuote();
  const confirmSentMutation = useConfirmPaymentSent();
  const uploadReceiptMutation = useUploadJobOrderReceipt();

  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const receiptFileInputRef = useRef<HTMLInputElement>(null);
  const [rejectQuoteId, setRejectQuoteId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [receiptFileUrl, setReceiptFileUrl] = useState<string>("");

  const isCancelled = request?.status === "CANCELLED";
  const quotes = request?.quotes ?? [];
  const selectableQuotes = quotes.filter(
    (q) => q.status !== "REJECTED" && q.status !== "WITHDRAWN"
  );
  const jobOrders = request?.jobOrders ?? [];
  const externalJobOrder = request?.ExternalJobOrder;
  const paymentRejected =
    jobOrders.some((jo) => jo.paymentRecord?.status === "REJECTED") ||
    externalJobOrder?.paymentRecord?.status === "REJECTED";
  const rejectionReason =
    jobOrders.find((jo) => jo.paymentRecord?.status === "REJECTED")?.paymentRecord?.rejectionReason ??
    externalJobOrder?.paymentRecord?.rejectionReason;
  const awaitingPaymentJob =
    jobOrders.find((jo) => jo.status === "AWAITING_PAYMENT") ??
    (externalJobOrder?.status === "AWAITING_PAYMENT" ? externalJobOrder : undefined);
  const stationAlreadyConfirmedSent =
    awaitingPaymentJob?.paymentRecord?.status === "STATION_CONFIRMED_SENT";

  const handleSelectQuote = () => {
    if (!id || !selectedQuoteId) {
      toast.error("Select a quote.");
      return;
    }
    selectQuoteMutation.mutate(
      { requestId: id, providerQuoteId: Number(selectedQuoteId) },
      {
        onSuccess: () => toast.success("Quote selected."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Select quote failed."),
      }
    );
  };

  const handleConfirmSentWithReceipt = (receiptFileUrlValue: string) => {
    if (!awaitingPaymentJob?.id) return;
    confirmSentMutation.mutate(
      {
        jobOrderId: awaitingPaymentJob.id,
        body: { receiptFileUrl: receiptFileUrlValue },
      },
      {
        onSuccess: () => toast.success("تم رفع الإيصال وتأكيد الدفع."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "فشل التأكيد."),
      }
    );
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!awaitingPaymentJob?.id || !file) return;
    uploadReceiptMutation.mutate(
      { jobOrderId: awaitingPaymentJob.id, file },
      {
        onSuccess: (data) => {
          if (data?.receiptFileUrl) {
            setReceiptFileUrl(data.receiptFileUrl);
            handleConfirmSentWithReceipt(data.receiptFileUrl);
          } else {
            toast.success("Receipt uploaded.");
          }
          e.target.value = "";
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Upload failed."),
      }
    );
  };

  const handleRejectQuote = () => {
    if (!id || rejectQuoteId == null || !rejectReason.trim()) {
      toast.error("Enter a rejection reason.");
      return;
    }
    rejectQuoteMutation.mutate(
      { requestId: id, providerQuoteId: rejectQuoteId, rejectionReason: rejectReason.trim() },
      {
        onSuccess: () => {
          toast.success("Quote rejected.");
          setRejectQuoteId(null);
          setRejectReason("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Reject failed."),
      }
    );
  };

  return (
    <div className="p-4 md:p-8">
      {isLoading || !id ? (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
          Loading...
        </div>
      ) : !request ? (
        <>
          <Button variant="ghost" asChild>
            <Link to="/station-requests">Back</Link>
          </Button>
          <p className="text-destructive">Request not found.</p>
        </>
      ) : (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/station-requests" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </Button>

      {isCancelled && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4">
            <p className="font-medium text-amber-800">Request cancelled.</p>
            {request.cancellationReason && (
              <p className="text-sm text-amber-700 mt-1">{request.cancellationReason}</p>
            )}
          </CardContent>
        </Card>
      )}

      {paymentRejected && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="font-medium text-destructive">Provider rejected payment.</p>
              {rejectionReason && (
                <p className="text-sm text-muted-foreground mt-1">{rejectionReason}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{request.title ?? request.formData?.description ?? `Request #${request.id}`}</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
            <Badge variant="secondary">{request.status}</Badge>
            {request.formData?.priority && (
              <span className="capitalize">Priority: {request.formData.priority}</span>
            )}
            {request.createdAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(request.createdAt).toLocaleString()}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(request.description ?? request.formData?.description) && (
            <p className="text-sm">{request.description ?? (request.formData?.description as string)}</p>
          )}

          {request.Branch && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Branch</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {request.Branch.nameEn ?? request.Branch.nameAr ?? `Branch #${request.Branch.id}`}
                </span>
                {request.Branch.address && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {request.Branch.address}
                    {request.Branch.street && ` · ${request.Branch.street}`}
                  </span>
                )}
                {request.Branch.managerName && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {request.Branch.managerName}
                    {request.Branch.managerPhone && ` · ${request.Branch.managerPhone}`}
                  </span>
                )}
              </div>
            </div>
          )}

          {quotes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">عروض الأسعار / Quotes</p>
              <ul className="space-y-2">
                {quotes.map((q) => {
                  const isRejected = q.status === "REJECTED";
                  const isWithdrawn = q.status === "WITHDRAWN";
                  const isInactive = isRejected || isWithdrawn;
                  const showRejectForm = !isCancelled && !isInactive && rejectQuoteId === q.id;
                  return (
                    <li
                      key={q.id}
                      className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm ${
                        isInactive ? "opacity-75 bg-muted/50 border-muted" : ""
                      }`}
                    >
                      <span>
                        Quote #{q.id}
                        {q.amount != null && ` · ${q.amount}`}
                        {q.providerOrganizationId != null && ` · Org ${q.providerOrganizationId}`}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {!isInactive && rejectQuoteId !== q.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive gap-1"
                            onClick={() => setRejectQuoteId(q.id)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        )}
                        {showRejectForm && (
                          <div className="flex flex-wrap items-end gap-2">
                            <div className="space-y-1 min-w-[180px]">
                              <Label htmlFor={`reject-reason-${q.id}`} className="text-xs">
                                Reason (required)
                              </Label>
                              <Input
                                id={`reject-reason-${q.id}`}
                                placeholder="Rejection reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={handleRejectQuote}
                              disabled={rejectQuoteMutation.isPending || !rejectReason.trim()}
                            >
                              Submit reject
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRejectQuoteId(null);
                                setRejectReason("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                        <Badge
                          variant={isRejected ? "destructive" : isWithdrawn ? "secondary" : "default"}
                          className="shrink-0"
                        >
                          {q.status ?? "—"}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {(quotes.some((q) => q.status === "REJECTED" || q.status === "WITHDRAWN") && (
                <p className="text-xs text-muted-foreground">
                  العروض الملغاة أو المرفوضة لا يمكن اختيارها.
                </p>
              ))}
            </div>
          )}

          {!isCancelled && (
            <>
              {selectableQuotes.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Select quote</p>
                  <div className="flex gap-2 items-center">
                    <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Choose quote" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectableQuotes.map((q) => (
                          <SelectItem key={q.id} value={String(q.id)}>
                            Quote #{q.id} · {q.amount != null ? `${q.amount}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={handleSelectQuote}
                      disabled={selectQuoteMutation.isPending || !selectedQuoteId}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              )}

              {awaitingPaymentJob && !paymentRejected && stationAlreadyConfirmedSent && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Payment sent. Waiting for provider to confirm receipt.
                  </p>
                </div>
              )}
              {awaitingPaymentJob && !paymentRejected && !stationAlreadyConfirmedSent && (
                <div className="pt-2 border-t space-y-2">
                  <p className="text-sm font-medium">الدفع</p>
                  <p className="text-xs text-muted-foreground">
                    ارفع إيصال التحويل لتأكيد إرسال المبلغ. المزود سيتلقى التأكيد ويستطيع بدء أمر العمل.
                  </p>
                  <input
                    ref={receiptFileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleReceiptFileChange}
                  />
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => receiptFileInputRef.current?.click()}
                    disabled={uploadReceiptMutation.isPending || confirmSentMutation.isPending}
                  >
                    <Upload className="h-4 w-4" /> رفع إيصال وتأكيد الدفع
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
      )}
    </div>
  );
}
