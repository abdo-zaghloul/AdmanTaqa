import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import useGetWorkOrderById from "@/hooks/WorkOrders/useGetWorkOrderById";
import useGetInternalTasks from "@/hooks/WorkOrders/useGetInternalTasks";
import useReviewWorkOrder from "@/hooks/WorkOrders/useReviewWorkOrder";
import useCloseWorkOrder from "@/hooks/WorkOrders/useCloseWorkOrder";
import { useAuth } from "@/context/AuthContext";
import WorkOrderStatusBadge from "./components/WorkOrderStatusBadge";
import AssignTaskDialog from "./components/AssignTaskDialog";
import InternalTasksTable from "./components/InternalTasksTable";

export default function WorkOrderDetails() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [reviewNote, setReviewNote] = useState("");

  const reviewMutation = useReviewWorkOrder();
  const closeMutation = useCloseWorkOrder();

  const { data: workOrder, isLoading, isError, error } = useGetWorkOrderById(id);
  const { data: tasksData, isLoading: tasksLoading } = useGetInternalTasks({
    workOrderId: id,
    page: 1,
    limit: 50,
  });

  const handleReview = (action: "APPROVE" | "REJECT") => {
    if (!id) return;
    reviewMutation.mutate(
      { id, body: { action, note: reviewNote || undefined } },
      {
        onSuccess: () => toast.success(`Work order ${action === "APPROVE" ? "approved" : "rejected"}.`),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to review work order."),
      }
    );
  };

  const handleClose = () => {
    if (!id) return;
    closeMutation.mutate(
      { id, note: reviewNote || undefined },
      {
        onSuccess: () => toast.success("Work order closed."),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to close work order."),
      }
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={() => navigate("/work-orders")}>
          Back to Work Orders
        </Button>
        {id && hasPermission("internal_tasks.assign") ? (
          <AssignTaskDialog workOrderId={id} />
        ) : null}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-muted-foreground">Loading work order details...</CardContent>
        </Card>
      ) : isError || !workOrder ? (
        <Card>
          <CardContent className="p-6 text-destructive">
            {error instanceof Error ? error.message : "Failed to load work order details."}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">#{workOrder.id}</span>
                  {workOrder.title}
                </span>
                <WorkOrderStatusBadge status={workOrder.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <p className="font-semibold">{workOrder.priority}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Branch ID</p>
                  <p className="font-semibold">{workOrder.branchId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Asset ID</p>
                  <p className="font-semibold">{workOrder.assetId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested By</p>
                  <p className="font-semibold">{workOrder.requestedByUserId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned User</p>
                  <p className="font-semibold">{workOrder.assignedUserId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created At</p>
                  <p className="font-semibold">{new Date(workOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Description</p>
                <p className="text-sm">{workOrder.description || "No description"}</p>
              </div>
              {hasPermission("workorders.approve") ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Review Note</p>
                    <Textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Optional note for review/close"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => handleReview("APPROVE")} disabled={reviewMutation.isPending}>
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReview("REJECT")}
                      disabled={reviewMutation.isPending}
                    >
                      Reject
                    </Button>
                    <Button variant="secondary" onClick={handleClose} disabled={closeMutation.isPending}>
                      Close Work Order
                    </Button>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Internal Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="text-sm text-muted-foreground">Loading internal tasks...</div>
              ) : (
                <InternalTasksTable items={tasksData?.items ?? []} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
