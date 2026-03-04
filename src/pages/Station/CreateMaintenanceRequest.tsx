import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Building2 } from "lucide-react";
import { toast } from "sonner";
import useGetBranches from "@/hooks/Branches/useGetBranches";
import useCreateMaintenanceRequest from "@/hooks/Station/useCreateMaintenanceRequest";
import useLinkedProviders from "@/hooks/Station/useLinkedProviders";
import type { MaintenanceMode, MaintenancePriority } from "@/types/station";

export default function CreateMaintenanceRequest() {
  const navigate = useNavigate();
  const { data: branches = [] } = useGetBranches();
  const { data: linkedProviders = [], isLoading: linkedLoading } = useLinkedProviders();
  const createMutation = useCreateMaintenanceRequest();

  const [branchId, setBranchId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MaintenancePriority>("MEDIUM");
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode>("INTERNAL");
  const [firstTaskNotes, setFirstTaskNotes] = useState("");
  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);

  const toggleProvider = (orgId: number) => {
    setSelectedProviderIds((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bid = branchId ? Number(branchId) : undefined;
    if (!bid || !title.trim()) {
      toast.error("Branch and title are required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }
    createMutation.mutate(
      {
        branchId: bid!,
        title: title.trim(),
        description: description.trim(),
        priority,
        maintenanceMode,
        firstTask:
          maintenanceMode === "INTERNAL" && firstTaskNotes.trim()
            ? { notes: firstTaskNotes.trim() }
            : undefined,
        providerOrganizationIds:
          maintenanceMode === "EXTERNAL" && selectedProviderIds.length > 0
            ? selectedProviderIds
            : undefined,
      },
      {
        onSuccess: (data) => {
          if (maintenanceMode === "EXTERNAL" && selectedProviderIds.length === 0 && data?.externalRequest?.id) {
            toast.success("Request created (SUBMITTED_BY_STATION). Send to providers from the request detail.");
          } else {
            toast.success("Maintenance request created.");
          }
          if (maintenanceMode === "INTERNAL" && data?.internalWorkOrder?.id) {
            navigate(`/internal-work-orders/${data.internalWorkOrder.id}`);
          } else if (maintenanceMode === "EXTERNAL" && data?.externalRequest?.id) {
            navigate(`/station-requests/${data.externalRequest.id}`);
          } else {
            navigate("/station-requests");
          }
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to create request."),
      }
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/station-requests" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>New Maintenance Request</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create internal (your team) or external (service provider) maintenance request.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Branch *</Label>
              <Select value={branchId} onValueChange={setBranchId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.nameEn ?? b.nameAr ?? `Branch ${b.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Request title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Request description (required)"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as MaintenancePriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Execution (Internal vs External)</Label>
              <Select
                value={maintenanceMode}
                onValueChange={(v) => setMaintenanceMode(v as MaintenanceMode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal (own team)</SelectItem>
                  <SelectItem value="EXTERNAL">External (service provider)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {maintenanceMode === "INTERNAL"
                  ? "Internal: المحطة تنفذ الطلب (موظفوها). مزود الخدمة لا يرى الطلبات الداخلية."
                  : "External: ينفذ مزود الخدمة بعد اختيار العرض وتأكيد الدفع (ثنائي الخطوة)."}
              </p>
            </div>
            {maintenanceMode === "INTERNAL" && (
              <div className="space-y-2">
                <Label htmlFor="firstTaskNotes">First task notes (optional)</Label>
                <Input
                  id="firstTaskNotes"
                  value={firstTaskNotes}
                  onChange={(e) => setFirstTaskNotes(e.target.value)}
                  placeholder="Notes for first internal task"
                />
              </div>
            )}
            {maintenanceMode === "EXTERNAL" && (
              <div className="space-y-2 rounded-lg border bg-muted/20 p-4">
                <Label className="text-base font-semibold">المزودون (اختياري)</Label>
                <p className="text-sm text-muted-foreground">
                  اختر مزودين ليرسل لهم الطلب الآن فيصبح الطلب QUOTING_OPEN. إن لم تختر أي مزود، يُنشأ الطلب بحالة SUBMITTED_BY_STATION ويمكنك إرساله للمزودين لاحقاً من صفحة تفاصيل الطلب (Send to providers).
                </p>
                {linkedLoading ? (
                  <p className="text-sm text-muted-foreground">Loading providers...</p>
                ) : linkedProviders.length === 0 ? (
                  <p className="text-sm text-amber-600">
                    لا يوجد مزودون مرتبطين. يمكنك إنشاء الطلب الآن (سيبقى SUBMITTED_BY_STATION) ثم{" "}
                    <Link to="/linked-providers" className="underline font-medium">
                      ربط مزودين
                    </Link>{" "}
                    وإرسال الطلب من تفاصيل الطلب لاحقاً.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {linkedProviders.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-3 rounded-md border bg-background px-3 py-2 cursor-pointer hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selectedProviderIds.includes(p.organizationId)}
                          onCheckedChange={() => toggleProvider(p.organizationId)}
                        />
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {p.organizationName ?? `Provider #${p.organizationId}`}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {linkedProviders.length > 0 && selectedProviderIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedProviderIds.length} مزود محدد. الطلب سيُرسل لهم ويصبح QUOTING_OPEN.
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create request"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/station-requests">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
