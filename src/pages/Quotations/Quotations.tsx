import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import PendingApprovalGuard from "@/components/PendingApprovalGuard";
import useGetQuotations from "@/hooks/Quotations/useGetQuotations";
import useCreateQuotation from "@/hooks/Quotations/useCreateQuotation";
import { useQuotationsWebList, type QuotationsWebStatus } from "@/hooks/Quotations/useQuotationsWeb";
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
import { DollarSign, Plus } from "lucide-react";
import QuotationsTableHeader from "./Component/QuotationsTableHeader";
import TableQuotations from "./Component/TableQuotations";
import TableQuotationsWeb from "./Component/TableQuotationsWeb";
import { useAuth } from "@/context/AuthContext";

const PAGE_TITLE_AUTHORITY = "Service offers";
const PAGE_TITLE_DEFAULT = "financial offers";
const PAGE_DESC_AUTHORITY = "Review and manage service offers for service requests.";
const PAGE_DESC_DEFAULT = "Review and manage financial offers for service requests.";

const QUOTATIONS_WEB_STATUS_OPTIONS: { value: QuotationsWebStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "REVISED", label: "Revised" },
  { value: "WITHDRAWN", label: "Withdrawn" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SELECTED", label: "Selected" },
];

export default function Quotations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;
  const [webStatus, setWebStatus] = useState<QuotationsWebStatus | "">("");
  const [serviceRequestId, setServiceRequestId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const { data: orgResponse, isLoading: orgLoading } = useGetOrganization();
  const { permissions, organization: authOrg } = useAuth();
  const organization = orgResponse?.data ?? authOrg;
  const isAuthority = organization?.type === "AUTHORITY";
  const isServiceProvider = organization?.type === "SERVICE_PROVIDER";
  const pageTitle = isAuthority ? PAGE_TITLE_AUTHORITY : PAGE_TITLE_DEFAULT;
  const pageDescription = isAuthority ? PAGE_DESC_AUTHORITY : PAGE_DESC_DEFAULT;

  const { data, isLoading, isError, error } = useGetQuotations(page, limit);
  const {
    data: webData,
    isLoading: webLoading,
    isError: webError,
    error: webErrorObj,
  } = useQuotationsWebList(
    { page, limit: 20, status: webStatus || undefined },
    { enabled: isServiceProvider }
  );

  const useWebList = isServiceProvider;
  const listData = useWebList ? webData : data;
  const listLoading = useWebList ? webLoading : isLoading;
  const listError = useWebList ? webError : isError;
  const listErrorObj = useWebList ? webErrorObj : error;
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

  const rows = (data?.items ?? []).map((item) => {
    const pricing = item.QuotationPricing;
    return {
      id: item.id,
      serviceRequestId: item.serviceRequestId,
      serviceProviderOrganizationId: item.serviceProviderOrganizationId,
      pricing: pricing ?? null,
      status: item.status,
      submittedAt: item.createdAt,
      providerName: item.Organization?.name ?? null,
      branchName:
        item.ServiceRequest?.Branch?.nameEn ??
        item.ServiceRequest?.Branch?.nameAr ??
        null,
      fuelStationName: item.ServiceRequest?.Organization?.name ?? null,
      submittedBy: item.User?.fullName ?? null,
      requestStatus: item.ServiceRequest?.status ?? null,
      priority: item.ServiceRequest?.formData?.priority ?? null,
      description: item.ServiceRequest?.formData?.description ?? null,
      amount: pricing?.amount != null ? String(pricing.amount) : null,
      currency: pricing?.currency ?? null,
    };
  });

  const webItems = webData?.items ?? [];
  const totalForPagination = listData?.total ?? 0;
  const pageForPagination = listData?.page ?? page;
  const limitForPagination = useWebList ? 20 : limit;
  const maxPage = Math.max(1, Math.ceil(totalForPagination / limitForPagination));

  return (
    <PendingApprovalGuard organization={organization} isLoading={orgLoading}>
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {pageDescription}
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
        <QuotationsTableHeader total={listData?.total} page={listData?.page ?? page} />
        {useWebList && (
          <div className="px-6 pb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <Select
              value={webStatus || "all"}
              onValueChange={(v) => {
                setWebStatus(v === "all" ? "" : (v as QuotationsWebStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {QUOTATIONS_WEB_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {listLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading quotations...</div>
        ) : listError ? (
          <div className="p-6 text-sm text-destructive">
            {listErrorObj instanceof Error ? listErrorObj.message : "Failed to load quotations."}
          </div>
        ) : useWebList ? (
          <TableQuotationsWeb items={webItems} />
        ) : (
          <TableQuotations
            quotations={rows}
            showAmountColumn={organization?.type !== "AUTHORITY"}
          />
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
            <span className="text-sm text-muted-foreground">
              Page {pageForPagination} of {maxPage}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => (p < maxPage ? p + 1 : p))}
              disabled={page >= maxPage}
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
