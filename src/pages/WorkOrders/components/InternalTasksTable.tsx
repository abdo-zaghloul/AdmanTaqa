import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InternalTaskItem, InternalTaskStatus } from "@/types/internalTask";
import InternalTaskStatusBadge from "./InternalTaskStatusBadge";
import useUpdateInternalTaskStatus from "@/hooks/WorkOrders/useUpdateInternalTaskStatus";
import useReviewInternalTask from "@/hooks/WorkOrders/useReviewInternalTask";
import useCloseInternalTask from "@/hooks/WorkOrders/useCloseInternalTask";
import useUploadInternalTaskAttachment from "@/hooks/WorkOrders/useUploadInternalTaskAttachment";
import { useAuth } from "@/context/AuthContext";

type Props = {
  items: InternalTaskItem[];
};

const STATUS_OPTIONS: InternalTaskStatus[] = [
  "ASSIGNED",
  "IN_PROGRESS",
  "PAUSED",
  "WAITING_PARTS",
  "COMPLETED",
  "CLOSED",
];

export default function InternalTasksTable({ items }: Props) {
  const { hasPermission } = useAuth();
  const updateStatusMutation = useUpdateInternalTaskStatus();
  const reviewMutation = useReviewInternalTask();
  const closeMutation = useCloseInternalTask();
  const uploadAttachmentMutation = useUploadInternalTaskAttachment();

  const handleStatusChange = (task: InternalTaskItem, status: InternalTaskStatus) => {
    updateStatusMutation.mutate(
      { id: task.id, body: { status }, workOrderId: task.workOrderId },
      {
        onSuccess: () => toast.success("Task status updated."),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to update task status."),
      }
    );
  };

  const handleReview = (task: InternalTaskItem, decision: "APPROVE" | "REJECT") => {
    reviewMutation.mutate(
      { id: task.id, body: { decision }, workOrderId: task.workOrderId },
      {
        onSuccess: () => toast.success(`Task ${decision === "APPROVE" ? "approved" : "rejected"}.`),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to review task."),
      }
    );
  };

  const handleClose = (task: InternalTaskItem) => {
    closeMutation.mutate(
      { id: task.id, workOrderId: task.workOrderId },
      {
        onSuccess: () => toast.success("Task closed."),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to close task."),
      }
    );
  };

  const handleAttachmentUpload = (task: InternalTaskItem, file: File) => {
    uploadAttachmentMutation.mutate(
      { id: task.id, file, workOrderId: task.workOrderId },
      {
        onSuccess: () => toast.success("Attachment uploaded."),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to upload attachment."),
      }
    );
  };

  const canUpdateStatus = hasPermission("internal_tasks.update_status");
  const canReview = hasPermission("internal_tasks.review");
  const canClose = hasPermission("internal_tasks.close");
  const canUpload = hasPermission("internal_tasks.upload");

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned User</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No internal tasks found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-mono text-xs">{task.id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{task.title ?? "Internal Task"}</p>
                    {task.description ? (
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <InternalTaskStatusBadge status={task.status} />
                </TableCell>
                <TableCell>{task.assignedUserId ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(task.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap gap-2 justify-end">
                    {canUpdateStatus ? (
                      <Select
                        value={task.status}
                        onValueChange={(value: InternalTaskStatus) =>
                          handleStatusChange(task, value)
                        }
                      >
                        <SelectTrigger className="w-[160px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}
                    {canReview ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(task, "APPROVE")}
                          disabled={reviewMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReview(task, "REJECT")}
                          disabled={reviewMutation.isPending}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    {canClose ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleClose(task)}
                        disabled={closeMutation.isPending}
                      >
                        Close
                      </Button>
                    ) : null}
                    {canUpload ? (
                      <label className="inline-flex">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            handleAttachmentUpload(task, file);
                            e.currentTarget.value = "";
                          }}
                        />
                        <span className="inline-flex h-8 items-center rounded-md border px-3 text-xs cursor-pointer">
                          Upload
                        </span>
                      </label>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
