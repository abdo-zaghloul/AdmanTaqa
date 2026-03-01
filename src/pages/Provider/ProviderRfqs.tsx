import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useProviderRfqs from "@/hooks/Provider/useProviderRfqs";

export default function ProviderRfqs() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useProviderRfqs({ page, limit });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RFQs</h1>
        <p className="text-muted-foreground">Requests for quote — submit your offers.</p>
      </div>
      <Card className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No RFQs.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((rfq) => (
              <li key={rfq.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{rfq.title ?? `RFQ #${rfq.id}`}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{rfq.status}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/provider-rfqs/${rfq.id}`}>View</Link>
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
