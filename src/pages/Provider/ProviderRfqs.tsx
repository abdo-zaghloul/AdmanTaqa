import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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

const PRIORITY_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function ProviderRfqs() {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string>("all");
  const limit = 20;
  const { data, isLoading } = useProviderRfqs({
    page,
    limit,
    title: title.trim() || undefined,
    priority: priority === "all" ? undefined : priority,
  });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setPage(1);
  };
  const handlePriorityChange = (value: string) => {
    setPriority(value);
    setPage(1);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RFQs</h1>
        <p className="text-muted-foreground">Requests for quote — submit your offers.</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Title</span>
          <Input
            placeholder="Search by title..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-[200px] h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Priority</span>
          <Select value={priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                <TableHead>Title</TableHead>
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
                  <TableCell className="font-medium">{rfqTitle(rfq)}</TableCell>
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
