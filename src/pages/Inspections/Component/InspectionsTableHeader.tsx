import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ClipboardCheck, Search } from "lucide-react";

type InspectionsTableHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  recordCount: number;
};

export default function InspectionsTableHeader({
  searchQuery,
  onSearchChange,
  recordCount,
}: InspectionsTableHeaderProps) {
  return (
    <CardHeader className="bg-slate-50/50 border-b">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-rose-600" />
          <CardTitle className="text-lg">Inspection Log</CardTitle>
          <Badge variant="secondary" className="ml-2">
            {recordCount} records
          </Badge>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search targets, inspectors..."
            className="pl-10 h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </CardHeader>
  );
}
