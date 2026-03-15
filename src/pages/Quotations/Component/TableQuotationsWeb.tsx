import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { QuotationsWebListItem } from "@/types/quotationsWeb";

type TableQuotationsWebProps = {
  items: QuotationsWebListItem[];
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-50 text-slate-700 border-slate-200",
    SUBMITTED: "bg-green-50 text-green-700 border-green-200",
    REVISED: "bg-blue-50 text-blue-700 border-blue-200",
    WITHDRAWN: "bg-amber-50 text-amber-700 border-amber-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    SELECTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <Badge className={`${styles[status] || "bg-gray-50"} border shadow-none font-medium text-[10px]`}>
      {status}
    </Badge>
  );
}

export default function TableQuotationsWeb({ items }: TableQuotationsWebProps) {
  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold text-foreground">Title</TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
            <TableHead className="font-bold text-foreground">Version</TableHead>
            <TableHead className="font-bold text-foreground">Branch</TableHead>
            <TableHead className="font-bold text-foreground">Station / Org</TableHead>
            <TableHead className="font-bold text-foreground">Created</TableHead>
            <TableHead className="font-bold text-foreground">Attachments</TableHead>
            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No offers found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const branch = item.ExternalRequest?.Branch;
              const org = item.ExternalRequest?.Organization;
              const formData = item.ExternalRequest?.formData as { title?: string } | undefined;
              const title = formData?.title ?? "—";
              const branchName = branch?.nameEn ?? branch?.nameAr ?? "—";
              const stationName = org?.name ?? "—";
              const created = item.createdAt
                ? new Date(item.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                : "—";
              return (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/20 transition-all border-b last:border-0 border-muted/20"
                >
                  <TableCell className="font-medium">
                    {title}
                  </TableCell>
                  <TableCell>
                    {item.status ? getStatusBadge(item.status) : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.version ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">{branchName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {stationName}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{created}</TableCell>
                  <TableCell className="text-sm">
                    {item.hasAttachments ? (
                      <Badge variant="secondary" className="text-[10px]">Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/quotations/${item.id}`} className="gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
}
