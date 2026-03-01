import { useState } from "react";
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
import { ChevronLeft, Send, CheckCircle, AlertCircle, Building2, MapPin, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import useStationRequestById from "@/hooks/Station/useStationRequestById";
import useAvailableProviders from "@/hooks/Station/useAvailableProviders";
import useSendToProviders from "@/hooks/Station/useSendToProviders";
import useSelectQuote from "@/hooks/Station/useSelectQuote";
import useConfirmPaymentSent from "@/hooks/Station/useConfirmPaymentSent";

export default function StationRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading } = useStationRequestById(id ?? null);
  const { data: availableProviders = [] } = useAvailableProviders();
  const sendMutation = useSendToProviders();
  const selectQuoteMutation = useSelectQuote();
  const confirmSentMutation = useConfirmPaymentSent();

  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [providerIds, setProviderIds] = useState<number[]>([]);

  const isCancelled = request?.status === "CANCELLED";
  const quotes = request?.quotes ?? [];
  const selectableQuotes = quotes.filter(
    (q) => q.status !== "REJECTED" && q.status !== "WITHDRAWN"
  );
  const jobOrders = request?.jobOrders ?? [];
  const paymentRejected = jobOrders.some(
    (jo) => jo.paymentRecord?.status === "REJECTED"
  );
  const rejectionReason = jobOrders.find(
    (jo) => jo.paymentRecord?.status === "REJECTED"
  )?.paymentRecord?.rejectionReason;
  const awaitingPaymentJob = jobOrders.find(
    (jo) => jo.status === "AWAITING_PAYMENT"
  );

  const handleSendToProviders = () => {
    if (!id || providerIds.length === 0) {
      toast.error("Select at least one provider.");
      return;
    }
    sendMutation.mutate(
      { requestId: id, providerOrganizationIds: providerIds },
      {
        onSuccess: () => toast.success("Sent to providers."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Send failed."),
      }
    );
  };

  const handleSelectQuote = () => {
    if (!id || !selectedQuoteId) {
      toast.error("Select a quote.");
      return;
    }
    selectQuoteMutation.mutate(
      { requestId: id, quoteId: Number(selectedQuoteId) },
      {
        onSuccess: () => toast.success("Quote selected."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Select quote failed."),
      }
    );
  };

  const handleConfirmSent = () => {
    if (!awaitingPaymentJob?.id) return;
    confirmSentMutation.mutate(
      { jobOrderId: awaitingPaymentJob.id },
      {
        onSuccess: () => toast.success("Payment send confirmed."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Confirm failed."),
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
                  return (
                    <li
                      key={q.id}
                      className={`flex items-center justify-between rounded-lg border p-3 text-sm ${
                        isInactive ? "opacity-75 bg-muted/50 border-muted" : ""
                      }`}
                    >
                      <span>
                        Quote #{q.id}
                        {q.amount != null && ` · ${q.amount}`}
                        {q.providerOrganizationId != null && ` · Org ${q.providerOrganizationId}`}
                      </span>
                      <Badge
                        variant={isRejected ? "destructive" : isWithdrawn ? "secondary" : "default"}
                        className="shrink-0"
                      >
                        {q.status ?? "—"}
                      </Badge>
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
              {availableProviders.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Send to providers</p>
                  <div className="flex flex-wrap gap-2">
                    {availableProviders.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={providerIds.includes(p.organizationId)}
                          onChange={() =>
                            setProviderIds((prev) =>
                              prev.includes(p.organizationId)
                                ? prev.filter((x) => x !== p.organizationId)
                                : [...prev, p.organizationId]
                            )
                          }
                        />
                        {p.organizationName ?? `Org ${p.organizationId}`}
                      </label>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSendToProviders}
                    disabled={sendMutation.isPending || providerIds.length === 0}
                    className="gap-1"
                  >
                    <Send className="h-4 w-4" /> Send to selected
                  </Button>
                </div>
              )}

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

              {awaitingPaymentJob && !paymentRejected && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Payment</p>
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={handleConfirmSent}
                    disabled={confirmSentMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" /> Confirm payment sent
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
