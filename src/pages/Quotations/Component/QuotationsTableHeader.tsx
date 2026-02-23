import { CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

type QuotationsTableHeaderProps = {
  total?: number;
  page?: number;
};

export default function QuotationsTableHeader({
  total,
  page,
}: QuotationsTableHeaderProps) {
  return (
    <CardHeader className="pb-3 px-6 pt-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Recent Offers
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Total: {total ?? 0} | Page: {page ?? 1}
        </p>
      </div>
    </CardHeader>
  );
}
