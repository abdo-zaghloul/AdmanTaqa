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
import { getApiErrorMessage } from "@/lib/utils";
import useProviderJobOrderById from "@/hooks/Provider/useProviderJobOrderById";
import useConfirmReceived from "@/hooks/Provider/useConfirmReceived";
import useAssignProviderJobOrderOperator from "@/hooks/Provider/useAssignProviderJobOrderOperator";
import useUpdateProviderJobOrderStatus from "@/hooks/Provider/useUpdateProviderJobOrderStatus";
import useSubmitJobOrderForCompletion from "@/hooks/Provider/useSubmitJobOrderForCompletion";
import useProviderJobOrderVisits from "@/hooks/Provider/useProviderJobOrderVisits";
import useProviderJobOrderVisitCheckin from "@/hooks/Provider/useProviderJobOrderVisitCheckin";
import useProviderJobOrderReports from "@/hooks/Provider/useProviderJobOrderReports";
import useCreateJobOrderReport from "@/hooks/Provider/useCreateJobOrderReport";
import useSubmitJobOrderReport from "@/hooks/Provider/useSubmitJobOrderReport";
import useGetOperators from "@/hooks/Provider/useGetOperators";
import useProviderJobOrderAttachments from "@/hooks/Provider/useProviderJobOrderAttachments";
import useUploadProviderJobOrderAttachment from "@/hooks/Provider/useUploadProviderJobOrderAttachment";

export default function ProviderJobOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useProviderJobOrderById(id ?? null);
  const confirmMutation = useConfirmReceived();
  const assignMutation = useAssignProviderJobOrderOperator();
  const statusMutation = useUpdateProviderJobOrderStatus();
  const { data: operators = [] } = useGetOperators();
  const { data: visits = [] } = useProviderJobOrderVisits(id);
  const checkinMutation = useProviderJobOrderVisitCheckin();
  const submitCompletionMutation = useSubmitJobOrderForCompletion();
  const { data: reports = [] } = useProviderJobOrderReports(id);
  const createReportMutation = useCreateJobOrderReport();
  const submitReportMutation = useSubmitJobOrderReport();
  const { data: attachmentsList = [] } = useProviderJobOrderAttachments(id);
  const uploadAttachmentMutation = useUploadProviderJobOrderAttachment();
  const attachmentFileRef = useRef<HTMLInputElement>(null);
  const [attachmentDescription, setAttachmentDescription] = useState("");
  const [selectedAttachmentFile, setSelectedAttachmentFile] = useState<File | null>(null);
  const executionAttachments =
    (order as { executionDetails?: { attachments?: Array<{ fileUrl?: string; uploadedAt?: string; description?: string | null }> } })?.executionDetails?.attachments ??
    (order as { ExecutionDetails?: { attachments?: Array<{ fileUrl?: string; uploadedAt?: string; description?: string | null }> } })?.ExecutionDetails?.attachments ??
    [];
  const formData = (order as { externalRequest?: { formData?: { title?: string; priority?: string; description?: string } } })?.externalRequest?.formData
    ?? (order as { ExternalRequest?: { formData?: { title?: string; priority?: string; description?: string } } })?.ExternalRequest?.formData;
  const requestTitle = formData?.title?.trim() || order?.title;
  const requestPriority = formData?.priority?.trim();
  const requestDescription = formData?.description?.trim() || order?.description;

  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [completionNote, setCompletionNote] = useState("");

  const isCancelled = order?.status === "CANCELLED";
  const paymentRejected = order?.paymentRecord?.status === "REJECTED";
  const awaitingPayment = order?.status === "AWAITING_PAYMENT";
  const isUnderReview = order?.status === "UNDER_REVIEW";
  const isActive = order?.status === "ACTIVE" || order?.status === "IN_PROGRESS" || order?.status === "WAITING_PARTS" || order?.status === "UNDER_REVIEW" || order?.status === "REWORK_REQUIRED";
  const canAssignOrUpdateStatus = isActive && !paymentRejected;
  const hasCompletedVisit = visits.some((v) => (v.status ?? "").toUpperCase() === "COMPLETED");
  const canSubmitForReview =
    !paymentRejected &&
    !isCancelled &&
    (order?.status === "ACTIVE" ||
      order?.status === "IN_PROGRESS" ||
      order?.status === "WAITING_PARTS" ||
      order?.status === "COMPLETED") &&
    !isUnderReview;

  const handleAssign = () => {
    const operatorId = Number(selectedOperatorId);
    if (!id || Number.isNaN(operatorId)) {
      toast.error("Select an operator.");
      return;
    }
    assignMutation.mutate(
      { jobOrderId: id, operatorId },
      {
        onSuccess: () => {
          toast.success("Operator assigned.");
          setSelectedOperatorId("");
        },
        onError: (e) => toast.error(getApiErrorMessage(e, "Assign failed.")),
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
        onError: (e) => toast.error(getApiErrorMessage(e, "Update failed.")),
      }
    );
  };

  const handleCheckin = () => {
    if (!id) return;
    checkinMutation.mutate(
      { jobOrderId: id },
      {
        onSuccess: () => toast.success("Visit check-in recorded."),
        onError: (e) => toast.error(getApiErrorMessage(e, "Check-in failed.")),
      }
    );
  };

  const handleSubmitForReview = () => {
    if (!id) return;
    submitCompletionMutation.mutate(
      { jobOrderId: id, body: completionNote ? { completionNote } : undefined },
      {
        onSuccess: () => toast.success("Job order submitted for station review."),
        onError: (e) => toast.error(getApiErrorMessage(e, "Submit failed.")),
      }
    );
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
        onError: (e) => toast.error(getApiErrorMessage(e, "Create report failed.")),
      }
    );
  };

  const handleSubmitReport = (reportId: number) => {
    if (!id) return;
    submitReportMutation.mutate(
      { jobOrderId: id, reportId },
      {
        onSuccess: () => toast.success("Report submitted for review."),
        onError: (e) => toast.error(getApiErrorMessage(e, "Submit report failed.")),
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
        onError: (e) => toast.error(getApiErrorMessage(e, "Action failed.")),
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
          <CardTitle>{requestTitle || "Job Order"}</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
            {requestPriority && (
              <Badge variant="outline" className="text-xs font-normal">{requestPriority}</Badge>
            )}
            {requestPriority && <span>·</span>}
            <Badge variant="secondary">{order.status}</Badge>
          </div>
          {requestDescription && (
            <p className="text-sm text-muted-foreground mt-2">{requestDescription}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">

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
                <p className="text-xs text-muted-foreground">
                  Assign an operator from your organization to this job order. Job order must be ACTIVE, IN_PROGRESS, WAITING_PARTS, or REWORK_REQUIRED.
                </p>
                <div className="flex flex-wrap gap-2 items-end">
                  <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Choose user" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.id} value={String(op.id)}>
                          {op.name ?? `Operator #${op.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handleAssign}
                    disabled={assignMutation.isPending || !selectedOperatorId}
                  >
                    Assign
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
              {canSubmitForReview && (
                <div className="pt-4 border-t space-y-2">
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Send className="h-4 w-4" /> Submit for station review
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Send this job order to the fuel station for approval (status will move to Under review).
                  </p>
                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="space-y-1 min-w-[200px]">
                      <Label className="text-xs">Completion note (optional)</Label>
                      <Input
                        placeholder="Completion note..."
                        value={completionNote}
                        onChange={(e) => setCompletionNote(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={handleSubmitForReview}
                      disabled={submitCompletionMutation.isPending}
                    >
                      <Send className="h-3.5 w-3.5" /> Submit for review
                    </Button>
                  </div>
                </div>
              )}
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <Paperclip className="h-4 w-4" /> Attachments
                </p>
                {(attachmentsList.length > 0 || executionAttachments.length > 0) ? (
                  <ul className="text-xs space-y-1.5">
                    {attachmentsList.map((a) => {
                      const href = a.url ?? a.fileUrl;
                      const label = a.name ?? a.description?.trim() ?? `Attachment ${a.id}`;
                      return (
                        <li key={a.id} className="flex flex-wrap items-center gap-2">
                          {href ? (
                            <a href={href} target="_blank" rel="noreferrer" className="text-primary underline">
                              {label}
                            </a>
                          ) : (
                            <span>{label}</span>
                          )}
                          {a.createdAt && (
                            <span className="text-muted-foreground">
                              {new Date(a.createdAt).toLocaleString()}
                            </span>
                          )}
                        </li>
                      );
                    })}
                    {executionAttachments.map((a, i) => (
                      <li key={`exec-${i}`} className="flex flex-wrap items-center gap-2">
                        {a.fileUrl ? (
                          <a href={a.fileUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                            {a.description?.trim() || `Attachment ${i + 1}`}
                          </a>
                        ) : (
                          <span>{a.description?.trim() || `Attachment ${i + 1}`}</span>
                        )}
                        {a.uploadedAt && (
                          <span className="text-muted-foreground">
                            {new Date(a.uploadedAt).toLocaleString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No attachments.</p>
                )}
                <div className="rounded border p-3 bg-muted/20 space-y-2">
                  <Label className="text-xs">Upload file or image</Label>
                  <div className="flex flex-wrap items-end gap-2">
                    <Input
                      type="file"
                      ref={attachmentFileRef}
                      accept="image/*,.pdf,application/pdf"
                      className="max-w-[220px] text-xs"
                      onChange={(e) => setSelectedAttachmentFile(e.target.files?.[0] ?? null)}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={attachmentDescription}
                      onChange={(e) => setAttachmentDescription(e.target.value)}
                      className="h-8 max-w-[180px] text-xs"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={!id || uploadAttachmentMutation.isPending || !selectedAttachmentFile}
                      onClick={() => {
                        if (!id || !selectedAttachmentFile) return;
                        uploadAttachmentMutation.mutate(
                          { jobOrderId: id, file: selectedAttachmentFile, description: attachmentDescription.trim() || undefined },
                          {
                            onSuccess: () => {
                              toast.success("Attachment uploaded.");
                              setAttachmentDescription("");
                              setSelectedAttachmentFile(null);
                              if (attachmentFileRef.current) attachmentFileRef.current.value = "";
                            },
                            onError: (e) => toast.error(getApiErrorMessage(e, "Upload failed.")),
                          }
                        );
                      }}
                    >
                      {uploadAttachmentMutation.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">PDF or image, max 5 MB.</p>
                </div>
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
                  {!hasCompletedVisit && (
                    <p className="text-xs text-amber-600 font-medium">
                      At least one completed visit is required before creating a report. Complete a visit in the Visits section above first.
                    </p>
                  )}
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Report title"
                    className="h-8"
                    disabled={!hasCompletedVisit}
                  />
                  <Textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="Content (optional)"
                    className="min-h-[60px] text-sm"
                    disabled={!hasCompletedVisit}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={handleCreateReport}
                    disabled={!hasCompletedVisit || createReportMutation.isPending || !reportTitle.trim()}
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
