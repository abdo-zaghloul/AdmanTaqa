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
import { ChevronLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
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

  if (isLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-4 md:p-8">
        <Button variant="ghost" asChild>
          <Link to="/station-requests">Back</Link>
        </Button>
        <p className="text-destructive">Request not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
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
          <CardTitle>{request.title ?? `Request #${request.id}`}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status: <Badge variant="secondary">{request.status}</Badge>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.description && <p className="text-sm">{request.description}</p>}

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
  );
}
