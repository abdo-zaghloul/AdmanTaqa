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
  console.log(quotations);
  
  const formatAmount = (row: QuotationRow) => {
    const amount = row.pricing?.amount;
    const currency = row.pricing?.currency ?? "";
    if (amount == null) return "N/A";
    const numeric = Number(amount);
    if (Number.isNaN(numeric)) return `${currency} ${String(amount)}`.trim();
    return `${currency} ${numeric.toLocaleString()}`.trim();
  };

  return (
    <CardContent className="p-0">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold text-foreground">Reference ID</TableHead>
            <TableHead className="font-bold text-foreground">Service Request</TableHead>
            <TableHead className="font-bold text-foreground">Provider</TableHead>
            <TableHead className="font-bold text-foreground">Amount</TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No quotations found.
              </TableCell>
            </TableRow>
          ) : (
            quotations.map((quo) => (
              <TableRow
                key={quo.id}
                className="hover:bg-muted/20 transition-all border-b last:border-0 border-muted/20"
              >
                <TableCell className="font-mono text-xs font-bold text-primary/70">
                  Q-{quo.id}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  REQ-{quo.serviceRequestId}
                </TableCell>
                <TableCell className="font-semibold text-sm">
                  {quo.serviceProviderOrganizationId != null
                    ? `Org #${quo.serviceProviderOrganizationId}`
                    : "N/A"}
                </TableCell>
                <TableCell className="font-bold text-slate-700">
                  {formatAmount(quo)}
                </TableCell>
                <TableCell>{getStatusBadge(quo.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
}
