import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";

export type FuelStationRow = {
  id: string;
  name: string;
  location: string;
  manager: string;
  email: string;
  phone: string;
  license: string;
  createdAt: string;
};

type TableFuelRetailProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  stations: FuelStationRow[];
};

export default function TableFuelRetail({
  searchQuery,
  onSearchChange,
  stations,
}: TableFuelRetailProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 px-6 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or location..."
              className="pl-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 divide-y">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-bold text-foreground">ID</TableHead>
                <TableHead className="font-bold text-foreground">Station</TableHead>
                <TableHead className="font-bold text-foreground">Location</TableHead>
                <TableHead className="font-bold text-foreground">Manager</TableHead>
                <TableHead className="font-bold text-foreground">License</TableHead>
                <TableHead className="font-bold text-foreground">Created At</TableHead>
                <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.length > 0 ? (
                stations.map((station) => (
                  <TableRow key={station.id} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                    <TableCell className="font-mono text-xs font-semibold text-primary/80">{station.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{station.name}</span>
                        <span className="text-xs text-muted-foreground">{station.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>{station.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{station.manager}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{station.license}</TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">
                      {new Date(station.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                        onClick={() => navigate(`/fuel-retail/${station.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                      <Search className="h-8 w-8" />
                      <p className="text-sm">No fuel stations found matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
