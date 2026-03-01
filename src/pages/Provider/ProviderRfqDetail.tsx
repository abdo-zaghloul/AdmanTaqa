import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import useProviderRfqById from "@/hooks/Provider/useProviderRfqById";
import useCreateQuote from "@/hooks/Provider/useCreateQuote";

export default function ProviderRfqDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: rfq, isLoading } = useProviderRfqById(id ?? null);
  const createQuoteMutation = useCreateQuote();

  const [amount, setAmount] = useState("");
  const [validUntil, setValidUntil] = useState("");

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

  if (isLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="p-4 md:p-8">
        <Button variant="ghost" asChild>
          <Link to="/provider-rfqs">Back</Link>
        </Button>
        <p className="text-destructive">RFQ not found.</p>
      </div>
    );
  }

  const quotes = rfq.quotes ?? [];

  return (
    <div className="p-4 md:p-8 space-y-6">
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
                {quotes.map((q) => (
                  <li
                    key={q.id}
                    className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                  >
                    <span>#{q.id} · {q.amount != null ? q.amount : ""}</span>
                    {q.status === "REJECTED" && (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                    {q.status === "WITHDRAWN" && (
                      <Badge variant="secondary">Withdrawn</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
