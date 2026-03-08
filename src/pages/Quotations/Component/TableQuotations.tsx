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
import type { QuotationItem } from "@/types/quotation";

export type QuotationRow = {
  id: number;
  serviceRequestId: number;
  serviceProviderOrganizationId?: number | null;
  pricing?: QuotationItem["QuotationPricing"];
  status: string;
  submittedAt: string;
  providerName?: string | null;
  branchName?: string | null;
  fuelStationName?: string | null;
  submittedBy?: string | null;
  /** ServiceRequest.status (e.g. PENDING) */
  requestStatus?: string | null;
  /** ServiceRequest.formData */
  priority?: string | null;
  description?: string | null;
};

type TableQuotationsProps = {
  quotations: QuotationRow[];
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    SUBMITTED: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DRAFT: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <Badge className={`${styles[status] || "bg-gray-50"} border shadow-none font-medium text-[10px]`}>
      {status}
    </Badge>
  );
}

export default function TableQuotations({ quotations }: TableQuotationsProps) {
  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold text-foreground">Priority</TableHead>
            <TableHead className="font-bold text-foreground">Description</TableHead>
            <TableHead className="font-bold text-foreground">Provider</TableHead>
            <TableHead className="font-bold text-foreground">Branch / Station</TableHead>
            <TableHead className="font-bold text-foreground">Submitted by</TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No quotations found.
              </TableCell>
            </TableRow>
          ) : (
            quotations.map((quo) => (
              <TableRow
                key={quo.id}
                className="hover:bg-muted/20 transition-all border-b last:border-0 border-muted/20"
              >
                <TableCell className="text-sm capitalize">
                  {quo.priority ?? "—"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={quo.description ?? undefined}>
                  {quo.description ?? "—"}
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  {quo.providerName ?? (quo.serviceProviderOrganizationId != null ? `Org #${quo.serviceProviderOrganizationId}` : "N/A")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {quo.branchName ?? "—"}
                  {quo.fuelStationName && (
                    <span className="block text-xs mt-0.5">{quo.fuelStationName}</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {quo.submittedBy ?? "—"}
                </TableCell>
                <TableCell>
                  {quo.requestStatus ? getStatusBadge(quo.requestStatus) : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
}
