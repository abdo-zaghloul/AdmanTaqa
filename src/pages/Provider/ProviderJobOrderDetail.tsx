import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import useProviderJobOrderById from "@/hooks/Provider/useProviderJobOrderById";
import useConfirmReceived from "@/hooks/Provider/useConfirmReceived";

export default function ProviderJobOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useProviderJobOrderById(id ?? null);
  const confirmMutation = useConfirmReceived();

  const [rejectionReason, setRejectionReason] = useState("");

  const isCancelled = order?.status === "CANCELLED";
  const paymentRejected = order?.paymentRecord?.status === "REJECTED";
  const awaitingPayment = order?.status === "AWAITING_PAYMENT";

  const handleConfirm = (confirm: boolean) => {
    if (!id) return;
    if (!confirm && !rejectionReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    confirmMutation.mutate(
      {
        jobOrderId: id,
        body: confirm
          ? { confirm: true }
          : { confirm: false, rejectionReason: rejectionReason.trim() },
      },
      {
        onSuccess: () =>
          toast.success(confirm ? "Payment received confirmed." : "Payment rejected."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Action failed."),
      }
    );
  };

  return (
    <div className="p-4 md:p-8">
      {isLoading || !id ? (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
          Loading...
        </div>
      ) : !order ? (
        <>
          <Button variant="ghost" asChild>
            <Link to="/provider-job-orders">Back</Link>
          </Button>
          <p className="text-destructive">Job order not found.</p>
        </>
      ) : (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/provider-job-orders" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </Button>

      {isCancelled && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4">
            <p className="font-medium text-amber-800">Job order cancelled.</p>
          </CardContent>
        </Card>
      )}

      {paymentRejected && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="font-medium text-destructive">Payment rejected.</p>
              {order.paymentRecord?.rejectionReason && (
                <p className="text-sm text-muted-foreground mt-1">
                  {order.paymentRecord.rejectionReason}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Job Order #{order.id}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status: <Badge variant="secondary">{order.status}</Badge>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.title && <p className="text-sm">{order.title}</p>}
          {order.description && <p className="text-sm text-muted-foreground">{order.description}</p>}

          {awaitingPayment && !paymentRejected && !isCancelled && (
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium">Confirm payment received</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={() => handleConfirm(true)}
                  disabled={confirmMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" /> Confirm received
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
                      placeholder="Reason"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => handleConfirm(false)}
                    disabled={confirmMutation.isPending || !rejectionReason.trim()}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
      )}
    </div>
  );
}
