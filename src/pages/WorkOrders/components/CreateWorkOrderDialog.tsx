import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCreateWorkOrder from "@/hooks/WorkOrders/useCreateWorkOrder";
import useGetBranches from "@/hooks/Branches/useGetBranches";
import useGetUsers from "@/hooks/Users/useGetUsers";
import useGetAssets from "@/hooks/Assets/useGetAssets";
import type { CreateWorkOrderBody, WorkOrderPriority } from "@/types/workOrder";

export default function CreateWorkOrderDialog() {
  const createMutation = useCreateWorkOrder();
  const { data: branches = [], isLoading: branchesLoading } = useGetBranches();
  const { data: usersResponse, isLoading: usersLoading } = useGetUsers();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<WorkOrderPriority>("MEDIUM");
  const [branchId, setBranchId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const selectedBranchId = branchId ? Number(branchId) : undefined;
  const { data: assets = [], isLoading: assetsLoading } = useGetAssets({
    branchId: selectedBranchId,
  });
  const users = usersResponse?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateWorkOrderBody = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      branchId: branchId ? Number(branchId) : undefined,
      assetId: assetId ? Number(assetId) : undefined,
      assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Work order created.");
        setOpen(false);
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setBranchId("");
        setAssetId("");
        setAssignedUserId("");
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to create work order.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Work Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>New Work Order</DialogTitle>
          <DialogDescription>
            Create a work order and optionally assign it to a technician directly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wo-title">Title</Label>
            <Input
              id="wo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Work order title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wo-description">Description</Label>
            <Textarea
              id="wo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v: WorkOrderPriority) => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">LOW</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned User</Label>
              <Select
                value={assignedUserId || "none"}
                onValueChange={(value) => setAssignedUserId(value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={usersLoading ? "Loading users..." : "Select user (optional)"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.fullName} (#{user.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                value={branchId || "none"}
                onValueChange={(value) => {
                  const next = value === "none" ? "" : value;
                  setBranchId(next);
                  setAssetId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={branchesLoading ? "Loading branches..." : "Select branch (optional)"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={String(branch.id)}>
                      {branch.nameEn || branch.nameAr || `Branch #${branch.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select
                value={assetId || "none"}
                onValueChange={(value) => setAssetId(value === "none" ? "" : value)}
                disabled={!branchId || assetsLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !branchId
                        ? "Select branch first"
                        : assetsLoading
                        ? "Loading assets..."
                        : "Select asset (optional)"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={String(asset.id)}>
                      {asset.nameEn || asset.nameAr || asset.name || `Asset #${asset.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
