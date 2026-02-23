import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import PendingApprovalGuard from "@/components/PendingApprovalGuard";
import useGetQuotations from "@/hooks/Quotations/useGetQuotations";
import useCreateQuotation from "@/hooks/Quotations/useCreateQuotation";
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
import { DollarSign, Plus } from "lucide-react";
import QuotationsTableHeader from "./Component/QuotationsTableHeader";
import TableQuotations from "./Component/TableQuotations";
import { useAuth } from "@/context/AuthContext";

export default function Quotations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;
  const [serviceRequestId, setServiceRequestId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const { data: orgResponse, isLoading: orgLoading } = useGetOrganization();
  const { permissions } = useAuth();
  const organization = orgResponse?.data;
  const { data, isLoading, isError, error } = useGetQuotations(page, limit);
  const createQuotation = useCreateQuotation();

  const canSubmitQuotation =
    organization?.type === "SERVICE_PROVIDER" &&
    permissions.includes("quotations:submit");

  const handleSubmitOffer = (e: FormEvent) => {
    e.preventDefault();
    const requestIdNum = Number(serviceRequestId);
    const amountNum = Number(amount);
    if (!requestIdNum || Number.isNaN(requestIdNum)) {
      toast.error("Please enter a valid service request ID.");
      return;
    }
    if (!amountNum || Number.isNaN(amountNum)) {
      toast.error("Please enter a valid amount.");
      return;
    }

    createQuotation.mutate(
      {
        serviceRequestId: requestIdNum,
        amount: amountNum,
        currency: currency || "USD",
      },
      {
        onSuccess: () => {
          toast.success("Quotation submitted successfully!");
          setIsCreateModalOpen(false);
          setServiceRequestId("");
          setAmount("");
          setCurrency("USD");
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to submit quotation.");
        },
      }
    );
  };

  const rows = (data?.items ?? []).map((item) => ({
    id: item.id,
    serviceRequestId: item.serviceRequestId,
    serviceProviderOrganizationId: item.serviceProviderOrganizationId,
    pricing: item.QuotationPricing ?? null,
    status: item.status,
    submittedAt: item.createdAt,
  }));

  return (
    <PendingApprovalGuard organization={organization} isLoading={orgLoading}>
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground">
            Review and manage financial offers for service requests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canSubmitQuotation && (
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
                    Submit quotation for a service request.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitOffer} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceRequestId">Service Request ID</Label>
                    <Input
                      id="serviceRequestId"
                      type="number"
                      value={serviceRequestId}
                      onChange={(e) => setServiceRequestId(e.target.value)}
                      placeholder="e.g., 15"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          className="pl-9"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        placeholder="USD"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createQuotation.isPending}>
                      {createQuotation.isPending ? "Submitting..." : "Send Offer"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
        <QuotationsTableHeader total={data?.total} page={data?.page} />
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading quotations...</div>
        ) : isError ? (
          <div className="p-6 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load quotations."}
          </div>
        ) : (
          <TableQuotations quotations={rows} />
        )}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground"> {page}</span>
            <Button
              variant="outline"
              onClick={() => {
                const maxPage = Math.max(
                  1,
                  Math.ceil((data?.total ?? rows.length) / Math.max(limit, 1))
                );
                setPage((p) => (p < maxPage ? p + 1 : p));
              }}
              disabled={page >= Math.max(1, Math.ceil((data?.total ?? rows.length) / Math.max(limit, 1)))}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
    </PendingApprovalGuard>
  );
}
