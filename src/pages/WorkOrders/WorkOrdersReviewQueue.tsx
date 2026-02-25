import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetWorkOrderReviewQueue from "@/hooks/WorkOrders/useGetWorkOrderReviewQueue";
import useGetInternalTaskReviewQueue from "@/hooks/WorkOrders/useGetInternalTaskReviewQueue";
import WorkOrderStatusBadge from "./components/WorkOrderStatusBadge";
import InternalTaskStatusBadge from "./components/InternalTaskStatusBadge";

export default function WorkOrdersReviewQueue() {
  const {
    data: workOrdersQueue,
    isLoading: woLoading,
    isError: woError,
    error: woErrorObject,
  } = useGetWorkOrderReviewQueue();
  const {
    data: tasksQueue,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorObject,
  } = useGetInternalTaskReviewQueue();

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
        <p className="text-muted-foreground">
          Pending review items for work orders and internal tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Work Orders Review Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {woLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : woError ? (
              <p className="text-sm text-destructive">
                {woErrorObject instanceof Error
                  ? woErrorObject.message
                  : "Failed to load work order queue."}
              </p>
            ) : (workOrdersQueue?.items.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">No work orders in queue.</p>
            ) : (
              workOrdersQueue?.items.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm">{order.title}</p>
                    <p className="text-xs text-muted-foreground">#{order.id}</p>
                  </div>
                  <WorkOrderStatusBadge status={order.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Internal Tasks Review Queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : tasksError ? (
              <p className="text-sm text-destructive">
                {tasksErrorObject instanceof Error
                  ? tasksErrorObject.message
                  : "Failed to load internal tasks queue."}
              </p>
            ) : (tasksQueue?.items.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">No internal tasks in queue.</p>
            ) : (
              tasksQueue?.items.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border p-3 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm">{task.title ?? "Internal Task"}</p>
                    <p className="text-xs text-muted-foreground">
                      Task #{task.id} · WorkOrder #{task.workOrderId}
                    </p>
                  </div>
                  <InternalTaskStatusBadge status={task.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
