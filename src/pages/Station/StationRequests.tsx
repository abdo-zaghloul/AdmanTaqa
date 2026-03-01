import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import useStationRequests from "@/hooks/Station/useStationRequests";

export default function StationRequests() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useStationRequests({ page, limit });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">External Requests</h1>
          <p className="text-muted-foreground">
            Maintenance requests sent to or to be sent to service providers.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/station-requests/create">
            <Plus className="h-4 w-4" />
            New Maintenance Request
          </Link>
        </Button>
      </div>
      <Card className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No external requests.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{r.title ?? `Request #${r.id}`}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{r.status}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/station-requests/${r.id}`}>View</Link>
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
