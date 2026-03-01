import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useInternalWorkOrders from "@/hooks/Station/useInternalWorkOrders";
import type { InternalWorkOrderStatus } from "@/types/internalWorkOrder";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function InternalWorkOrders() {
  const [status, setStatus] = useState<InternalWorkOrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useInternalWorkOrders({ status, page, limit });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internal Work Orders</h1>
          <p className="text-muted-foreground">
            Internal maintenance orders (Fuel Station only). Execute via your own team.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/station-requests/create">
            <Plus className="h-4 w-4" />
            New Maintenance Request
          </Link>
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as InternalWorkOrderStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
              <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
              <SelectItem value="CLOSED">CLOSED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No internal work orders.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((wo) => (
              <li key={wo.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{wo.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">#{wo.id}</span>
                  <span className="ml-2 text-xs uppercase">{wo.status}</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/internal-work-orders/${wo.id}`}>View</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
        {total > limit && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
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
