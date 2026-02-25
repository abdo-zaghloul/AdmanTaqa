import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import useCreateInternalTask from "@/hooks/WorkOrders/useCreateInternalTask";
import useGetUsers from "@/hooks/Users/useGetUsers";
import { Input } from "@/components/ui/input";

type Props = {
  workOrderId: number | string;
};

export default function AssignTaskDialog({ workOrderId }: Props) {
  const createTaskMutation = useCreateInternalTask();
  const { data: usersResponse, isLoading: usersLoading } = useGetUsers();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const users = usersResponse?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(
      {
        workOrderId,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Internal task assigned.");
          setOpen(false);
          setTitle("");
          setDescription("");
          setAssignedUserId("");
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Failed to assign task.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Assign Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Internal Task</DialogTitle>
          <DialogDescription>
            This task will be linked to work order #{workOrderId}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
