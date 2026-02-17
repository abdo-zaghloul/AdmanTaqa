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
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Plus } from "lucide-react";
import QuotationsTableHeader from "./Component/QuotationsTableHeader";
import TableQuotations from "./Component/TableQuotations";

// Mock Data
const MOCK_QUOTATIONS = [
  {
    id: "QUO-9001",
    requestId: "REQ-2024-001",
    provider: "EcoEnergy Services",
    amount: 1250,
    currency: "SAR",
    status: "ACCEPTED",
    submittedAt: "2024-02-09T10:00:00Z",
  },
  {
    id: "QUO-9002",
    requestId: "REQ-2024-001",
    provider: "Maintenance Masters",
    amount: 1100,
    currency: "SAR",
    status: "PENDING",
    submittedAt: "2024-02-09T11:30:00Z",
  },
  {
    id: "QUO-9003",
    requestId: "REQ-2024-002",
    provider: "EcoEnergy Services",
    amount: 4500,
    currency: "SAR",
    status: "DRAFT",
    submittedAt: "2024-02-07T14:20:00Z",
  },
  {
    id: "QUO-9004",
    requestId: "REQ-2024-004",
    provider: "Local Tech Squad",
    amount: 800,
    currency: "SAR",
    status: "REJECTED",
    submittedAt: "2024-02-10T09:00:00Z",
  },
];

export default function Quotations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Quotation submitted successfully!");
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Review and manage financial offers for service requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md">
                <Plus className="h-4 w-4" />
                Submit New Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Submit New Offer</DialogTitle>
                <DialogDescription>
                  Create and send a new quotation for a service request.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitOffer} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestRef">Request Reference</Label>
                    <Input id="requestRef" placeholder="e.g., REQ-2024-001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Total Amount (SAR)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="amount" type="number" className="pl-9" placeholder="0.00" required />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Quotation Subject</Label>
                  <Input id="subject" placeholder="e.g., Repair Proposal for Fuel Pump" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Scope of Work</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the services and items included in this offer..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input id="validUntil" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Attach PDF (Optional)</Label>
                    <Input id="file" type="file" accept=".pdf" className="cursor-pointer" />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Offer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
        <QuotationsTableHeader />
        <TableQuotations quotations={MOCK_QUOTATIONS} />
      </Card>
    </div>
  );
}
