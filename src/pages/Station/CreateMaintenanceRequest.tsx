import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import useGetBranches from "@/hooks/Branches/useGetBranches";
import useAvailableProviders from "@/hooks/Station/useAvailableProviders";
import useCreateMaintenanceRequest from "@/hooks/Station/useCreateMaintenanceRequest";
import type { MaintenanceMode, MaintenancePriority } from "@/types/station";

export default function CreateMaintenanceRequest() {
  const navigate = useNavigate();
  const { data: branches = [] } = useGetBranches();
  const { data: availableProviders = [], isLoading: providersLoading } = useAvailableProviders();
  const createMutation = useCreateMaintenanceRequest();

  const [branchId, setBranchId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MaintenancePriority>("MEDIUM");
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode>("INTERNAL");
  const [firstTaskNotes, setFirstTaskNotes] = useState("");
  const [providerIds, setProviderIds] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bid = branchId ? Number(branchId) : undefined;
    if (!bid || !title.trim()) {
      toast.error("Branch and title are required.");
      return;
    }
    if (maintenanceMode === "EXTERNAL" && providerIds.length === 0) {
      toast.error("يجب اختيار مزود واحد على الأقل");
      return;
    }

    createMutation.mutate(
      {
        branchId: bid!,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        maintenanceMode,
        firstTask:
          maintenanceMode === "INTERNAL" && firstTaskNotes.trim()
            ? { notes: firstTaskNotes.trim() }
            : undefined,
        providerOrganizationIds: maintenanceMode === "EXTERNAL" ? providerIds : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Maintenance request created.");
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

  const toggleProvider = (id: number) => {
    setProviderIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
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
              <Label>Execution</Label>
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
              <div className="space-y-2">
                <Label>إرسال لمزودين (اختر واحداً على الأقل)</Label>
                <div className="flex flex-wrap gap-2 border rounded-lg p-3">
                  {providersLoading ? (
                    <p className="text-sm text-muted-foreground">Loading providers...</p>
                  ) : availableProviders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      محطتك غير مرتبطة بأي مزود. يرجى ربط مزودين أولاً من إعدادات النظام.
                    </p>
                  ) : (
                    availableProviders.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={providerIds.includes(p.organizationId)}
                          onChange={() => toggleProvider(p.organizationId)}
                        />
                        <span className="text-sm">{p.organizationName ?? `Org ${p.organizationId}`}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Request"}
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
