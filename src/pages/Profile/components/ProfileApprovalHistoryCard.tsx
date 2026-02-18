import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import useGetOrganizationApprovalHistory from "@/hooks/Organization/useGetOrganizationApprovalHistory";
import type { ApprovalHistoryItem } from "@/types/organization";

interface ProfileApprovalHistoryCardProps {
  organizationId: number;
}

export default function ProfileApprovalHistoryCard({ organizationId }: ProfileApprovalHistoryCardProps) {
  const { data: history = [], isLoading } = useGetOrganizationApprovalHistory(organizationId);

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5" />
          Approval History
        </CardTitle>
        <CardDescription>Approval and rejection history for your organization.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No approval history yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((item: ApprovalHistoryItem, idx: number) => (
              <li
                key={item.id ?? idx}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={item.decision === "APPROVED" ? "default" : "destructive"}>
                    {item.decision}
                  </Badge>
                  {item.reason && <span className="text-muted-foreground">{item.reason}</span>}
                </div>
                <span className="text-muted-foreground text-xs">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
