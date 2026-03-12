import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, Pencil, LogOut, Building2, MapPin, Calendar, Hash, CheckCircle, XCircle, Briefcase, CreditCard, Info } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useProviderRfqById from "@/hooks/Provider/useProviderRfqById";
import useReviseQuote from "@/hooks/Provider/useReviseQuote";
import useWithdrawQuote from "@/hooks/Provider/useWithdrawQuote";
import useConfirmReceived from "@/hooks/Provider/useConfirmReceived";
import useProviderJobOrders from "@/hooks/Provider/useProviderJobOrders";
import { getQuotePaymentTerms } from "@/types/provider";

function formatDate(s: string | undefined): string {
  if (!s) return "—";
  return new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** Human-readable label for payment trigger (from backend). */
function paymentTriggerLabel(trigger: string | undefined): string {
  if (!trigger) return "—";
  const map: Record<string, string> = {
    ON_APPROVAL: "On quote approval (when station selects this quote)",
    ON_JOB_START: "When job starts",
    ON_COMPLETION_SUBMITTED: "When completion is submitted",
    ON_JOB_CLOSED: "When job is closed",
  };
  return map[trigger] ?? trigger;
}

export default function ProviderRfqDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: rfq, isLoading } = useProviderRfqById(id ?? null);
  const { data: jobOrdersData } = useProviderJobOrders(
    rfq?.status === "AWAITING_PAYMENT" ? { status: "AWAITING_PAYMENT" } : undefined
  );
  const reviseQuoteMutation = useReviseQuote();
  const withdrawQuoteMutation = useWithdrawQuote();
  const confirmReceivedMutation = useConfirmReceived();

  const quotes = rfq?.ProviderQuotes ?? rfq?.quotes ?? [];
  const selectedQuote = quotes.find((q) => q.status === "SELECTED");
  const externalJobOrder = selectedQuote?.ExternalJobOrder;
  const jobOrderId =
    externalJobOrder?.id ??
    jobOrdersData?.items?.find((jo) => jo.externalRequestId === rfq?.id)?.id;

  const [rejectionReason, setRejectionReason] = useState("");
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null);
  const [reviseAmount, setReviseAmount] = useState("");
  const [reviseValidUntil, setReviseValidUntil] = useState("");

  const title = rfq?.formData?.title ?? rfq?.title ?? `RFQ #${rfq?.id}`;
  const description = rfq?.formData?.description ?? rfq?.description;
  const priority = rfq?.formData?.priority;

  const canReviseOrWithdraw = (q: { status?: string }) =>
    q.status !== "REJECTED" && q.status !== "WITHDRAWN" && q.status !== "ACCEPTED" && q.status !== "SELECTED";

  const handleStartRevise = (q: { id: number; amount?: number; validUntil?: string }) => {
    setEditingQuoteId(q.id);
    setReviseAmount(String(q.amount ?? ""));
    setReviseValidUntil(q.validUntil?.slice(0, 10) ?? "");
  };

  const handleSaveRevise = () => {
    if (editingQuoteId == null) return;
    const num = Number(reviseAmount);
    if (Number.isNaN(num) || num <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    reviseQuoteMutation.mutate(
      {
        quoteId: editingQuoteId,
        body: {
          amount: num,
          validUntil: reviseValidUntil.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Quote updated.");
          setEditingQuoteId(null);
          setReviseAmount("");
          setReviseValidUntil("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed."),
      }
    );
  };

  const handleWithdraw = (quoteId: number) => {
    if (!confirm("Withdraw this quote? This cannot be undone.")) return;
    withdrawQuoteMutation.mutate(quoteId, {
      onSuccess: () => toast.success("Quote withdrawn."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Withdraw failed."),
    });
  };

  const handleConfirmReceived = (confirm: boolean) => {
    if (jobOrderId == null) {
      toast.error("Job order not found for this RFQ.");
      return;
    }
    if (!confirm && !rejectionReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    confirmReceivedMutation.mutate(
      {
        jobOrderId,
        body: confirm
          ? { confirm: true }
          : { confirm: false, rejectionReason: rejectionReason.trim() },
      },
      {
        onSuccess: () => {
          toast.success(confirm ? "Payment receipt confirmed." : "Payment receipt rejected.");
          setRejectionReason("");
          queryClient.invalidateQueries({ queryKey: ["provider-rfq", id] });
        },
        onError: (e) =>
          toast.error(e instanceof Error ? e.message : "Failed to confirm receipt."),
      }
    );
  };

  const awaitingPayment = rfq?.status === "AWAITING_PAYMENT";
  const paymentRecord = externalJobOrder?.PaymentRecord;
  const paymentRecordStatus = paymentRecord?.status;
  const paymentRejected = paymentRecordStatus === "REJECTED";
  const alreadyConfirmed = paymentRecordStatus === "PROVIDER_CONFIRMED_RECEIVED";
  const receiptFileUrl = (paymentRecord as { receiptFileUrl?: string | null } | undefined)?.receiptFileUrl;
  const canConfirmReceived =
    awaitingPayment &&
    !paymentRejected &&
    !alreadyConfirmed &&
    jobOrderId != null;

  return (
    <div className="p-4 md:p-8">
      {isLoading || !id ? (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
          Loading...
        </div>
      ) : !rfq ? (
        <>
          <Button variant="ghost" asChild>
            <Link to="/provider-rfqs">Back</Link>
          </Button>
          <p className="text-destructive">RFQ not found.</p>
        </>
      ) : (
        <div className="space-y-6">
          <Button variant="ghost" asChild>
            <Link to="/provider-rfqs" className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
          </Button>

          {rfq.Branch && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" />
                  Branch
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="font-medium">{rfq.Branch.nameEn ?? rfq.Branch.nameAr ?? `Branch #${rfq.Branch.id}`}</p>
                {rfq.Branch.address && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {rfq.Branch.address}
                    {rfq.Branch.street && `, ${rfq.Branch.street}`}
                  </p>
                )}
                {(rfq.Branch.latitude || rfq.Branch.longitude) && (
                  <p className="text-muted-foreground text-xs">
                    {[rfq.Branch.latitude, rfq.Branch.longitude].filter(Boolean).join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {(rfq.Organization || rfq.Area || rfq.City) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization & location</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {rfq.Organization && (
                  <p><span className="text-muted-foreground">Organization:</span> {rfq.Organization.name ?? `#${rfq.Organization.id}`}</p>
                )}
                {rfq.Area && (
                  <p><span className="text-muted-foreground">Area:</span> {rfq.Area.name ?? `#${rfq.Area.id}`}</p>
                )}
                {rfq.City && (
                  <p><span className="text-muted-foreground">City:</span> {rfq.City.name ?? `#${rfq.City.id}`}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                {title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary">{rfq.status ?? "—"}</Badge>
                {priority && <span className="text-muted-foreground">Priority: {priority}</span>}
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {formatDate(rfq.createdAt)}
                </span>
                {rfq.updatedAt && rfq.updatedAt !== rfq.createdAt && (
                  <span className="text-muted-foreground">Updated {formatDate(rfq.updatedAt)}</span>
                )}
              </div>

              {/* <p className="text-xs text-muted-foreground mt-1">
                ID {rfq.id}
                {rfq.branchId != null && ` · Branch ${rfq.branchId}`}
                {rfq.fuelStationOrganizationId != null && ` · Station org ${rfq.fuelStationOrganizationId}`}
                {rfq.areaId != null && ` · Area ${rfq.areaId}`}
              </p> */}

            </CardHeader>
            {canConfirmReceived && (
              <div className="ms-6 pt-2 pb-2 border-b space-y-2">
                <p className="text-sm font-medium">Confirm payment received</p>
                <div className="flex flex-wrap gap-2 items-end">
                  <Button
                    size="sm"
                    className="gap-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleConfirmReceived(true)}
                    disabled={confirmReceivedMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4" /> Confirm receipt
                  </Button>
                  <div className="flex flex-1 min-w-[200px] gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="rejectionReason" className="text-xs">
                        Rejection reason (if rejecting)
                      </Label>
                      <Input
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Rejection reason"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleConfirmReceived(false)}
                      disabled={
                        confirmReceivedMutation.isPending || !rejectionReason.trim()
                      }
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {awaitingPayment && !jobOrderId && !paymentRejected && (
              <p className="text-sm text-muted-foreground ms-6 py-2">
                You can confirm payment receipt from the related job order page.{" "}
                <Link to="/provider-job-orders" className="text-primary underline">
                  View job orders
                </Link>
              </p>
            )}
            {alreadyConfirmed && externalJobOrder?.id != null && (
              <div className="ms-6 pt-2 pb-2 border-b">
                <Button size="sm" variant="outline" className="gap-2" asChild>
                  <Link to={`/provider-job-orders/${externalJobOrder.id}`}>
                    <Briefcase className="h-4 w-4" />
                    Job Order
                  </Link>
                </Button>
              </div>
            )}
            {receiptFileUrl && (
              <div className="ms-6 pt-2 pb-2 border-b space-y-2">
                <p className="text-sm font-medium">Payment receipt</p>
                <a
                  href={receiptFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg border overflow-hidden bg-muted/30 max-w-[280px]"
                >
                  <img
                    src={receiptFileUrl}
                    alt="Payment receipt"
                    className="w-full h-auto object-contain max-h-64"
                  />
                </a>
                <p className="text-xs text-muted-foreground">
                  <a href={receiptFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Open receipt in new tab
                  </a>
                </p>
              </div>
            )}
            <CardContent className="space-y-4">
              {description && rfq.status !== "AWAITING_PAYMENT" && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                  <p className="text-sm mt-1">{description}</p>
                </div>
              )}

              {rfq.status !== "AWAITING_PAYMENT" && (
                <>
                  {quotes.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Your quotes</p>
                      <ul className="space-y-2">
                        {quotes.map((q) => {
                          const showActions = canReviseOrWithdraw(q);
                          const isEditing = editingQuoteId === q.id;
                          const quotePaymentTerms = getQuotePaymentTerms(q);
                          return (
                            <li
                              key={q.id}
                              className="flex flex-col gap-2 rounded border px-3 py-2 text-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                {!isEditing ? (
                                  <React.Fragment key="view">
                                    <span>#{q.id} · {q.amount != null ? q.amount : ""}{q.validUntil ? ` · Valid until ${q.validUntil.slice(0, 10)}` : ""}</span>
                                    <div className="flex items-center gap-2">
                                      {showActions && (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1 h-7"
                                            onClick={() => handleStartRevise(q)}
                                            disabled={reviseQuoteMutation.isPending}
                                          >
                                            <Pencil className="h-3 w-3" /> Revise
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="gap-1 text-destructive hover:text-destructive h-7"
                                            onClick={() => handleWithdraw(q.id)}
                                            disabled={withdrawQuoteMutation.isPending}
                                          >
                                            <LogOut className="h-3 w-3" /> Withdraw
                                          </Button>
                                        </>
                                      )}
                                      {q.status === "REJECTED" && <Badge variant="destructive">Rejected</Badge>}
                                      {q.status === "WITHDRAWN" && <Badge variant="secondary">Withdrawn</Badge>}
                                      {q.status === "ACCEPTED" && <Badge variant="default">Accepted</Badge>}
                                      {q.status === "SELECTED" && <Badge variant="default">Selected</Badge>}
                                    </div>
                                  </React.Fragment>
                                ) : (
                                  <React.Fragment key="edit">
                                    <div className="flex flex-wrap items-end gap-2">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Amount</Label>
                                        <Input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={reviseAmount}
                                          onChange={(e) => setReviseAmount(e.target.value)}
                                          className="h-8 w-24"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Valid until</Label>
                                        <Input
                                          type="date"
                                          value={reviseValidUntil}
                                          onChange={(e) => setReviseValidUntil(e.target.value)}
                                          className="h-8 w-36"
                                        />
                                      </div>
                                      <Button size="sm" onClick={handleSaveRevise} disabled={reviseQuoteMutation.isPending}>
                                        Save
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => { setEditingQuoteId(null); setReviseAmount(""); setReviseValidUntil(""); }}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </React.Fragment>
                                )}
                              </div>
                              
                              {!isEditing && quotePaymentTerms.length > 0 && (
                                <div className="w-full mt-1 pt-2 border-t border-muted/50 space-y-2">
                                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Payment terms (installments)
                                  </p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="border-muted/50 hover:bg-transparent">
                                        <TableHead className="text-xs font-medium">#</TableHead>
                                        <TableHead className="text-xs font-medium">Percent</TableHead>
                                        <TableHead className="text-xs font-medium">When due</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {quotePaymentTerms
                                        .slice()
                                        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
                                        .map((term) => (
                                          <TableRow key={term.id ?? term.sequence ?? 0} className="border-muted/50">
                                            <TableCell className="text-xs py-1">{term.sequence ?? "—"}</TableCell>
                                            <TableCell className="text-xs py-1">{term.percent ?? "—"}%</TableCell>
                                            <TableCell className="text-xs py-1">{paymentTriggerLabel(term.trigger)}</TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                  <div className="flex gap-1.5 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                    <span>
                                      Payment is made in {quotePaymentTerms.length} installment{quotePaymentTerms.length !== 1 ? "s" : ""}. The fuel station confirms &quot;payment sent&quot; for each milestone; you then confirm &quot;received&quot; (or reject with a reason). Until both confirm, the job stays in AWAITING_PAYMENT.
                                    </span>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
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
