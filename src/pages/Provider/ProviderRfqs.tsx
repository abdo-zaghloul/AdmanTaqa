import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProviderRfqs from "@/hooks/Provider/useProviderRfqs";
import type { ProviderRfqItem } from "@/types/provider";

function rfqTitle(rfq: ProviderRfqItem): string {
  return rfq.formData?.title ?? rfq.title ?? `RFQ #${rfq.id}`;
}

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-mono">{rfq.id}</TableCell>
                  <TableCell className="font-medium">{rfqTitle(rfq)}</TableCell>
                  <TableCell>{rfq.status ?? "—"}</TableCell>
                  <TableCell>{rfq.formData?.priority ?? "—"}</TableCell>
                  <TableCell>
                    {rfq.Branch?.nameEn ?? rfq.Branch?.nameAr ?? (rfq.branchId != null ? `Branch ${rfq.branchId}` : "—")}
                  </TableCell>
                  <TableCell>{rfq.Organization?.name ?? "—"}</TableCell>
                  <TableCell>{rfq.Area?.name ?? "—"}</TableCell>
                  <TableCell>
                    {rfq.createdAt
                      ? new Date(rfq.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/provider-rfqs/${rfq.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {total > limit && (
          <div className="flex gap-2 pt-4">
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
            <span className="text-sm text-muted-foreground self-center">
              {total} total
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
