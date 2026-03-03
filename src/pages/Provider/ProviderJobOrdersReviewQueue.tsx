import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronLeft, Clock } from "lucide-react";
import useGetJobOrderReviewQueue from "@/hooks/Provider/useGetJobOrderReviewQueue";

export default function ProviderJobOrdersReviewQueue() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useGetJobOrderReviewQueue({ page, limit });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <Link to="/provider-job-orders">
          <ChevronLeft className="h-4 w-4" />
          Back to Job Orders
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Clock className="h-8 w-8" />
          Review Queue
        </h1>
        <p className="text-muted-foreground">
          Job orders awaiting your confirmation that payment was received.
        </p>
      </div>
      <Card className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No job orders in review queue.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((jo) => (
              <li key={jo.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{jo.title ?? `Job Order #${jo.id}`}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{jo.status}</span>
                  {jo.branch && <span className="ml-2 text-xs text-muted-foreground">· {jo.branch}</span>}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/provider-job-orders/${jo.id}`}>Confirm payment</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
        {total > limit && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
