import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import JobOrdersTableHeader from "./Component/JobOrdersTableHeader";
import TableJobOrders from "./Component/TableJobOrders";

// Mock Data
const MOCK_JOB_ORDERS = [
  {
    id: "JO-5501",
    title: "Pump Replacement",
    provider: "Maintenance Masters",
    branch: "North Riyadh",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    status: "IN_PROGRESS",
  },
  {
    id: "JO-5502",
    title: "Safety Valve Calibration",
    provider: "EcoEnergy Services",
    branch: "Jeddah Port",
    startDate: "2024-02-15",
    endDate: "2024-02-15",
    status: "PLANNED",
  },
  {
    id: "JO-5503",
    title: "Electrical Rewiring",
    provider: "Local Tech Squad",
    branch: "Mecca East",
    startDate: "2024-02-08",
    endDate: "2024-02-09",
    status: "COMPLETED",
  },
  {
    id: "JO-5504",
    title: "Underground Tank Inspection",
    provider: "EcoEnergy Services",
    branch: "Dammam South",
    startDate: "2024-02-20",
    endDate: "2024-02-22",
    status: "PENDING",
  },
];

export default function JobOrders() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateJobOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Job order created successfully!");
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Orders</h1>
          <p className="text-muted-foreground">
            Track ongoing maintenance and installation tasks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" className="gap-2 shadow-sm">
            <Filter className="h-4 w-4" />
            Filter
          </Button> */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md">
                <Plus className="h-4 w-4" />
                New Job Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Job Order</DialogTitle>
                <DialogDescription>
                  Assign a new job order to a team or organization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateJobOrder} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" placeholder="e.g., Annual Pump Maintenance" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select defaultValue="MAINTENANCE">
                      <SelectTrigger id="jobType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="INSTALLATION">Installation</SelectItem>
                        <SelectItem value="INSPECTION">Inspection</SelectItem>
                        <SelectItem value="REPAIR">Emergency Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="MEDIUM">
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned Team / Organization</Label>
                  <Select defaultValue="ECO_ENERGY">
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ECO_ENERGY">EcoEnergy Services</SelectItem>
                      <SelectItem value="MAINT_MASTERS">Maintenance Masters</SelectItem>
                      <SelectItem value="INTERNAL">Internal Team A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Expected End Date</Label>
                    <Input id="endDate" type="date" required />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Order</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
        <JobOrdersTableHeader />
        <TableJobOrders orders={MOCK_JOB_ORDERS} />
      </Card>
    </div>
  );
}
