import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle, XCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import useInternalWorkOrderById from "@/hooks/Station/useInternalWorkOrderById";
import useReviewInternalWorkOrder from "@/hooks/Station/useReviewInternalWorkOrder";
import useCloseInternalWorkOrder from "@/hooks/Station/useCloseInternalWorkOrder";

export default function InternalWorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useInternalWorkOrderById(id ?? null);
  const reviewMutation = useReviewInternalWorkOrder();
  const closeMutation = useCloseInternalWorkOrder();

  const handleReview = (decision: "APPROVE" | "REJECT") => {
    if (!id) return;
    reviewMutation.mutate(
      { id, body: { decision } },
      {
        onSuccess: () => toast.success(`Order ${decision === "APPROVE" ? "approved" : "rejected"}.`),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Review failed."),
      }
    );
  };

  const handleClose = () => {
    if (!id) return;
    closeMutation.mutate(id, {
      onSuccess: () => toast.success("Order closed."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Close failed."),
    });
  };

  if (isLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/internal-work-orders")} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <p className="text-destructive">Internal work order not found.</p>
      </div>
    );
  }

  const canReview = order.status === "UNDER_REVIEW";
  const canClose = order.status !== "CLOSED";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/internal-work-orders" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </Button>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{order.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {order.id} · <Badge variant="secondary">{order.status}</Badge>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canReview && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleReview("APPROVE")}
                  disabled={reviewMutation.isPending}
                  className="gap-1"
                >
                  <CheckCircle className="h-4 w-4" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReview("REJECT")}
                  disabled={reviewMutation.isPending}
                  className="gap-1"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </>
            )}
            {canClose && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                disabled={closeMutation.isPending}
                className="gap-1"
              >
                <Lock className="h-4 w-4" /> Close
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {order.description && <p className="text-sm">{order.description}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
