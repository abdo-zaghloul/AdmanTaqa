import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import useStationJobOrders from "@/hooks/Station/useStationJobOrders";

export default function StationJobOrders() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useStationJobOrders({ page, limit });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Orders</h1>
          <p className="text-muted-foreground">
            External job orders linked to your station requests.
          </p>
        </div>
      </div>
      <Card className="p-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No job orders.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((jo) => (
              <li key={jo.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {jo.ServiceRequest?.formData?.description ?? `Job Order #${jo.id}`}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {jo.status ?? "—"}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/station-job-orders/${jo.id}`}>View</Link>
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
