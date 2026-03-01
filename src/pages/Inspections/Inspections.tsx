import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Building2, User } from "lucide-react";
import InspectionsTableHeader from "./Component/InspectionsTableHeader";
import TableInspections from "./Component/TableInspections";

const MOCK_INSPECTIONS = [
  {
    id: "INS-2024-501",
    target: "Al-Amal Fuel Station",
    branch: "North Riyadh",
    type: "FUEL_STATION",
    inspector: "Mohammed Khalid",
    status: "COMPLETED",
    findings: "Minor issues found in safety equipment storage.",
    date: "2024-02-05",
  },
  {
    id: "INS-2024-502",
    target: "EcoEnergy Services",
    branch: "Main Hub",
    type: "SERVICE_PROVIDER",
    inspector: "Sarah Al-Ghamdi",
    status: "IN_PROGRESS",
    findings: "In-depth review of maintenance workspace.",
    date: "2024-02-10",
  },
  {
    id: "INS-2024-503",
    target: "Red Sea Petroleum",
    branch: "Highway 10",
    type: "FUEL_STATION",
    inspector: "Mohammed Khalid",
    status: "SCHEDULED",
    findings: "Annual safety and compliance inspection.",
    date: "2024-02-15",
  },
  {
    id: "INS-2024-504",
    target: "Masters Maintenance",
    branch: "East Zone",
    type: "SERVICE_PROVIDER",
    inspector: "Ahmed Mansour",
    status: "CANCELLED",
    findings: "Rescheduled due to provider request.",
    date: "2024-01-30",
  },
];

const MOCK_INSPECTORS = [
  { id: "INS-001", name: "Mohammed Khalid" },
  { id: "INS-002", name: "Sarah Al-Ghamdi" },
  { id: "INS-003", name: "Ahmed Mansour" },
  { id: "INS-004", name: "Fatima Hassan" },
];

const MOCK_TARGETS = [
  { id: "TRG-001", name: "Al-Amal Fuel Station", type: "FUEL_STATION" },
  { id: "TRG-002", name: "EcoEnergy Services", type: "SERVICE_PROVIDER" },
  { id: "TRG-003", name: "Red Sea Petroleum", type: "FUEL_STATION" },
  { id: "TRG-004", name: "Masters Maintenance", type: "SERVICE_PROVIDER" },
];

export default function Inspections() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Inspection plan created successfully!");
    setIsCreateModalOpen(false);
  };

  const filteredInspections = MOCK_INSPECTIONS.filter(
    (ins) =>
      ins.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.inspector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Inspections</h1>
          <p className="text-muted-foreground">
            Plan, conduct, and review regulatory inspections across all organizations.
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md bg-rose-600 hover:bg-rose-500 text-white">
              <Plus className="h-4 w-4" />
              New Inspection Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Inspection Plan</DialogTitle>
              <DialogDescription>
                Schedule a new compliance inspection for an organization or branch.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateInspection} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target Organization</Label>
                  <Select defaultValue={MOCK_TARGETS[0].id}>
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_TARGETS.map((target) => (
                        <SelectItem key={target.id} value={target.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3" />
                            {target.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspector">Assigned Inspector</Label>
                  <Select defaultValue={MOCK_INSPECTORS[0].id}>
                    <SelectTrigger id="inspector">
                      <SelectValue placeholder="Select inspector" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_INSPECTORS.map((inspector) => (
                        <SelectItem key={inspector.id} value={inspector.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {inspector.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inspectionType">Inspection Type</Label>
                  <Select defaultValue="ROUTINE">
                    <SelectTrigger id="inspectionType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROUTINE">Routine Inspection</SelectItem>
                      <SelectItem value="SAFETY">Safety Audit</SelectItem>
                      <SelectItem value="COMPLIANCE">Compliance Review</SelectItem>
                      <SelectItem value="FOLLOW_UP">Follow-up Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input id="scheduledDate" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope">Inspection Scope</Label>
                <Textarea
                  id="scope"
                  placeholder="Define the scope and focus areas of this inspection..."
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Input id="notes" placeholder="Any special instructions or notes..." />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-500">Schedule Inspection</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <InspectionsTableHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          recordCount={filteredInspections.length}
        />
        <TableInspections inspections={filteredInspections} searchQuery={searchQuery} />
      </Card>
    </div>
  );
}
