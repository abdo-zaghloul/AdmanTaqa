import { useNavigate } from "react-router-dom";
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

export type QuotationRow = {
  id: string;
  requestId: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  submittedAt: string;
};

type TableQuotationsProps = {
  quotations: QuotationRow[];
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
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
  const navigate = useNavigate();

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
            <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
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
                <TableCell className="font-mono text-xs font-bold text-primary/70">{quo.id}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{quo.requestId}</TableCell>
                <TableCell className="font-semibold text-sm">{quo.provider}</TableCell>
                <TableCell className="font-bold text-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">{quo.currency}</span>
                    {quo.amount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(quo.status)}</TableCell>
                <TableCell className="text-right px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 hover:bg-primary/5 hover:text-primary transition-all rounded-md"
                    onClick={() => navigate(`/quotations/${quo.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
}
