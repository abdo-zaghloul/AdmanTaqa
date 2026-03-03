import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, UserPlus, RefreshCw, MapPin, Paperclip, Send, FileText } from "lucide-react";
import { toast } from "sonner";
import useProviderJobOrderById from "@/hooks/Provider/useProviderJobOrderById";
import useConfirmReceived from "@/hooks/Provider/useConfirmReceived";
import useAssignProviderJobOrderOperator from "@/hooks/Provider/useAssignProviderJobOrderOperator";
import useUpdateProviderJobOrderStatus from "@/hooks/Provider/useUpdateProviderJobOrderStatus";
import useSubmitJobOrderForCompletion from "@/hooks/Provider/useSubmitJobOrderForCompletion";
import useProviderJobOrderVisits from "@/hooks/Provider/useProviderJobOrderVisits";
import useProviderJobOrderVisitCheckin from "@/hooks/Provider/useProviderJobOrderVisitCheckin";
import useProviderJobOrderAttachments from "@/hooks/Provider/useProviderJobOrderAttachments";
import useUploadProviderJobOrderAttachment from "@/hooks/Provider/useUploadProviderJobOrderAttachment";
import useProviderJobOrderReports from "@/hooks/Provider/useProviderJobOrderReports";
import useCreateJobOrderReport from "@/hooks/Provider/useCreateJobOrderReport";
import useSubmitJobOrderReport from "@/hooks/Provider/useSubmitJobOrderReport";
import useGetUsers from "@/hooks/Users/useGetUsers";

export default function ProviderJobOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useProviderJobOrderById(id ?? null);
  const confirmMutation = useConfirmReceived();
  const assignMutation = useAssignProviderJobOrderOperator();
  const statusMutation = useUpdateProviderJobOrderStatus();
  const { data: usersData } = useGetUsers();
  const users = usersData?.data ?? [];
  const { data: visits = [] } = useProviderJobOrderVisits(id);
  const { data: attachments = [] } = useProviderJobOrderAttachments(id);
  const checkinMutation = useProviderJobOrderVisitCheckin();
  const uploadAttachmentMutation = useUploadProviderJobOrderAttachment();
  const submitCompletionMutation = useSubmitJobOrderForCompletion();
  const { data: reports = [] } = useProviderJobOrderReports(id);
  const createReportMutation = useCreateJobOrderReport();
  const submitReportMutation = useSubmitJobOrderReport();
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");

  const isCancelled = order?.status === "CANCELLED";
  const paymentRejected = order?.paymentRecord?.status === "REJECTED";
  const awaitingPayment = order?.status === "AWAITING_PAYMENT";
  const isUnderReview = order?.status === "UNDER_REVIEW";
  const isActive = order?.status === "ACTIVE" || order?.status === "IN_PROGRESS" || order?.status === "WAITING_PARTS" || order?.status === "UNDER_REVIEW";
  const canAssignOrUpdateStatus = isActive && !paymentRejected;
  const canSubmitForReview =
    !paymentRejected &&
    !isCancelled &&
    (order?.status === "ACTIVE" ||
      order?.status === "IN_PROGRESS" ||
      order?.status === "WAITING_PARTS" ||
      order?.status === "COMPLETED") &&
    !isUnderReview;

  const handleAssign = () => {
    const uid = Number(selectedUserId);
    if (!id || Number.isNaN(uid)) {
      toast.error("Select a user.");
      return;
    }
    assignMutation.mutate(
      { jobOrderId: id, userId: uid },
      {
        onSuccess: () => {
          toast.success("Operator assigned.");
          setSelectedUserId("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Assign failed."),
      }
    );
  };

  const handleUpdateStatus = () => {
    if (!id || !newStatus) {
      toast.error("Select a status.");
      return;
    }
    if (newStatus === "CANCELLED" && !cancellationReason.trim()) {
      toast.error("Cancellation reason is required.");
      return;
    }
    statusMutation.mutate(
      {
        jobOrderId: id,
        body: newStatus === "CANCELLED" ? { status: newStatus, cancellationReason: cancellationReason.trim() } : { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success("Status updated.");
          setNewStatus("");
          setCancellationReason("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed."),
      }
    );
  };

  const handleCheckin = () => {
    if (!id) return;
    checkinMutation.mutate(
      { jobOrderId: id },
      {
        onSuccess: () => toast.success("Visit check-in recorded."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Check-in failed."),
      }
    );
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!id || !file) return;
    uploadAttachmentMutation.mutate(
      { jobOrderId: id, file },
      {
        onSuccess: () => {
          toast.success("Attachment uploaded.");
          e.target.value = "";
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Upload failed."),
      }
    );
  };

  const handleSubmitForReview = () => {
    if (!id) return;
    submitCompletionMutation.mutate(id, {
      onSuccess: () => toast.success("Job order submitted for station review."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Submit failed."),
    });
  };

  const handleCreateReport = () => {
    if (!id || !reportTitle.trim()) {
      toast.error("Report title is required.");
      return;
    }
    createReportMutation.mutate(
      { jobOrderId: id, body: { title: reportTitle.trim(), content: reportContent.trim() || undefined } },
      {
        onSuccess: () => {
          toast.success("Report created.");
          setReportTitle("");
          setReportContent("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Create report failed."),
      }
    );
  };

  const handleSubmitReport = (reportId: number) => {
    if (!id) return;
    submitReportMutation.mutate(
      { jobOrderId: id, reportId },
      {
        onSuccess: () => toast.success("Report submitted for review."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Submit report failed."),
      }
    );
  };

  const handleConfirm = (confirm: boolean) => {
    if (!id) return;
    if (!confirm && !rejectionReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    confirmMutation.mutate(
      {
        jobOrderId: id,
        body: confirm
          ? { confirm: true }
          : { confirm: false, rejectionReason: rejectionReason.trim() },
      },
      {
        onSuccess: () =>
          toast.success(confirm ? "Payment received confirmed." : "Payment rejected."),
        onError: (e) => toast.error(e instanceof Error ? e.message : "Action failed."),
      }
    );
  };

  return (
    <div className="p-4 md:p-8">
      {isLoading || !id ? (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
          Loading...
        </div>
      ) : !order ? (
        <>
          <Button variant="ghost" asChild>
            <Link to="/provider-job-orders">Back</Link>
          </Button>
          <p className="text-destructive">Job order not found.</p>
        </>
      ) : (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/provider-job-orders" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
      </Button>

      {isCancelled && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4">
            <p className="font-medium text-amber-800">Job order cancelled.</p>
          </CardContent>
        </Card>
      )}

      {paymentRejected && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="font-medium text-destructive">Payment rejected.</p>
              {order.paymentRecord?.rejectionReason && (
                <p className="text-sm text-muted-foreground mt-1">
                  {order.paymentRecord.rejectionReason}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Job Order #{order.id}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status: <Badge variant="secondary">{order.status}</Badge>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.title && <p className="text-sm">{order.title}</p>}
          {order.description && <p className="text-sm text-muted-foreground">{order.description}</p>}

          {awaitingPayment && !paymentRejected && !isCancelled && (
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm font-medium">Confirm payment received</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="gap-1"
                  onClick={() => handleConfirm(true)}
                  disabled={confirmMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" /> Confirm received
                </Button>
                <div className="flex flex-1 min-w-[200px] gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="rejectionReason" className="text-xs">
                      Rejection reason (if rejecting)
                    </Label>
                    <Input
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Reason"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => handleConfirm(false)}
                    disabled={confirmMutation.isPending || !rejectionReason.trim()}
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          )}

          {canAssignOrUpdateStatus && (
            <>
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <UserPlus className="h-4 w-4" /> Assign operator
                </p>
                <div className="flex flex-wrap gap-2 items-end">
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Choose user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={String(u.id)}>
                          {u.fullName} {u.email ? `(${u.email})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handleAssign}
                    disabled={assignMutation.isPending || !selectedUserId}
                  >
                    Assign
                  </Button>
                </div>
              </div>
              {canSubmitForReview && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Send className="h-4 w-4" /> Submit for station review
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Send this job order to the fuel station for approval (status will move to Under review).
                  </p>
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={handleSubmitForReview}
                    disabled={submitCompletionMutation.isPending}
                  >
                    <Send className="h-3.5 w-3.5" /> Submit for review
                  </Button>
                </div>
              )}
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" /> Update status
                </p>
                <div className="flex flex-wrap gap-2 items-end">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                      <SelectItem value="WAITING_PARTS">Waiting parts</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under review</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {newStatus === "CANCELLED" && (
                    <div className="space-y-1 min-w-[200px]">
                      <Label className="text-xs">Reason (required)</Label>
                      <Input
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Cancellation reason"
                      />
                    </div>
                  )}
                  <Button
                    size="sm"
                    onClick={handleUpdateStatus}
                    disabled={
                      statusMutation.isPending ||
                      !newStatus ||
                      (newStatus === "CANCELLED" && !cancellationReason.trim())
                    }
                  >
                    Update
                  </Button>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Visits
                </p>
                {visits.length > 0 && (
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {visits.map((v) => (
                      <li key={v.id}>
                        {v.visitDate ?? v.createdAt} — {v.status ?? "—"}
                        {v.notes ? ` · ${v.notes}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={handleCheckin}
                  disabled={checkinMutation.isPending}
                >
                  <MapPin className="h-3.5 w-3.5" /> Check-in visit
                </Button>
              </div>
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Paperclip className="h-4 w-4" /> Attachments
                </p>
                {attachments.length > 0 && (
                  <ul className="text-xs space-y-1">
                    {attachments.map((a) => (
                      <li key={a.id}>
                        {a.url ? (
                          <a href={a.url} target="_blank" rel="noreferrer" className="text-primary underline">
                            {a.name ?? `Attachment #${a.id}`}
                          </a>
                        ) : (
                          <span>{a.name ?? `Attachment #${a.id}`}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <input
                  ref={attachmentInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleAttachmentChange}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => attachmentInputRef.current?.click()}
                  disabled={uploadAttachmentMutation.isPending}
                >
                  <Paperclip className="h-3.5 w-3.5" /> Upload attachment
                </Button>
              </div>
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Maintenance reports
                </p>
                {reports.length > 0 && (
                  <ul className="text-xs space-y-2">
                    {reports.map((r) => (
                      <li key={r.id} className="rounded border p-2 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-medium">{r.title ?? `Report #${r.id}`}</span>
                          <Badge variant="outline" className="ml-2 text-[10px]">{r.status ?? "DRAFT"}</Badge>
                          {r.content && (
                            <p className="text-muted-foreground mt-1 line-clamp-2">{r.content}</p>
                          )}
                        </div>
                        {r.status !== "SUBMITTED" && r.status !== "APPROVED" && r.status !== "REJECTED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleSubmitReport(r.id)}
                            disabled={submitReportMutation.isPending}
                          >
                            <Send className="h-3 w-3" /> Submit
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="space-y-2 rounded border p-3 bg-muted/20">
                  <Label className="text-xs">New report</Label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Report title"
                    className="h-8"
                  />
                  <Textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="Content (optional)"
                    className="min-h-[60px] text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={handleCreateReport}
                    disabled={createReportMutation.isPending || !reportTitle.trim()}
                  >
                    <FileText className="h-3.5 w-3.5" /> Create report
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
      )}
    </div>
  );
}
