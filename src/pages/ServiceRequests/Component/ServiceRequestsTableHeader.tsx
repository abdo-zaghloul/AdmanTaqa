import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
 

export default function ServiceRequestsTableHeader() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service request created successfully!");
    setIsCreateModalOpen(false);
  };

  return (
    <>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
      <p className="text-muted-foreground">
        Track and manage maintenance and technical requests from all stations.
      </p>
    </div>
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-md">
          <Plus className="h-4 w-4" />
          New Service Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Service Request</DialogTitle>
          <DialogDescription>
            Submit a new maintenance or technical service request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateRequest} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Request Subject</Label>
            <Input id="subject" placeholder="e.g., Fuel Pump Maintenance" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="station">Station</Label>
              <Select defaultValue="AL_AMAL">
                <SelectTrigger id="station">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL_AMAL">Al-Amal Station</SelectItem>
                  <SelectItem value="RED_SEA">Red Sea Petroleum</SelectItem>
                  <SelectItem value="DESERT">Desert Oasis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input id="branch" placeholder="e.g., North Riyadh" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select defaultValue="MEDIUM">
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about the issue or request..."
              className="min-h-[100px]"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card className="bg-blue-50/30 border-blue-100">
      <CardHeader className="p-4 pb-2">
        <CardDescription className="text-blue-600 font-semibold uppercase text-[10px] tracking-wider">
          Total Open
        </CardDescription>
        <CardTitle className="text-2xl font-bold text-blue-700">12</CardTitle>
      </CardHeader>
    </Card>
    <Card className="bg-amber-50/30 border-amber-100">
      <CardHeader className="p-4 pb-2">
        <CardDescription className="text-amber-600 font-semibold uppercase text-[10px] tracking-wider">
          In Progress
        </CardDescription>
        <CardTitle className="text-2xl font-bold text-amber-700">5</CardTitle>
      </CardHeader>
    </Card>
    <Card className="bg-green-50/30 border-green-100">
      <CardHeader className="p-4 pb-2">
        <CardDescription className="text-green-600 font-semibold uppercase text-[10px] tracking-wider">
          Completed Today
        </CardDescription>
        <CardTitle className="text-2xl font-bold text-green-700">8</CardTitle>
      </CardHeader>
    </Card>
  </div>

    </>
    
  );
}
