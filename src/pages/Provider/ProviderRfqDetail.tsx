import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Pencil, LogOut } from "lucide-react";
import { toast } from "sonner";
import useProviderRfqById from "@/hooks/Provider/useProviderRfqById";
import useCreateQuote from "@/hooks/Provider/useCreateQuote";
import useReviseQuote from "@/hooks/Provider/useReviseQuote";
import useWithdrawQuote from "@/hooks/Provider/useWithdrawQuote";

export default function ProviderRfqDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: rfq, isLoading } = useProviderRfqById(id ?? null);
  const createQuoteMutation = useCreateQuote();
  const reviseQuoteMutation = useReviseQuote();
  const withdrawQuoteMutation = useWithdrawQuote();

  const [amount, setAmount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null);
  const [reviseAmount, setReviseAmount] = useState("");
  const [reviseValidUntil, setReviseValidUntil] = useState("");

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!id || Number.isNaN(num) || num <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    createQuoteMutation.mutate(
      {
        rfqId: id,
        body: {
          amount: num,
          validUntil: validUntil.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Quote submitted.");
          setAmount("");
          setValidUntil("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Submit failed."),
      }
    );
  };

  const quotes = rfq?.quotes ?? [];

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
      <Card>
        <CardHeader>
          <CardTitle>{rfq.title ?? `RFQ #${rfq.id}`}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status: <Badge variant="secondary">{rfq.status}</Badge>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {rfq.description && <p className="text-sm">{rfq.description}</p>}

          <form onSubmit={handleSubmitQuote} className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium">Submit quote</p>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="validUntil">Valid until (optional)</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={createQuoteMutation.isPending}>
                  {createQuoteMutation.isPending ? "Submitting..." : "Submit quote"}
                </Button>
              </div>
            </div>
          </form>

          {quotes.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Your quotes</p>
              <ul className="space-y-2">
                {quotes.map((q) => {
                  const showActions = canReviseOrWithdraw(q);
                  const isEditing = editingQuoteId === q.id;
                  return (
                    <li
                      key={q.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded border px-3 py-2 text-sm"
                    >
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
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
      )}
    </div>
  );
}
