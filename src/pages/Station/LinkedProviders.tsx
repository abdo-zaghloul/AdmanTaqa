import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Building2, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useLinkedProviders from "@/hooks/Station/useLinkedProviders";
import useAvailableProviders from "@/hooks/Station/useAvailableProviders";
import useAddLinkedProvider from "@/hooks/Station/useAddLinkedProvider";
import useRemoveLinkedProvider from "@/hooks/Station/useRemoveLinkedProvider";

export default function LinkedProviders() {
  const { data: linked = [], isLoading } = useLinkedProviders();
  const { data: available = [] } = useAvailableProviders();
  const addMutation = useAddLinkedProvider();
  const removeMutation = useRemoveLinkedProvider();

  const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  const linkedOrgIds = new Set(linked.map((p) => p.organizationId));
  const canAdd = available.filter((p) => !linkedOrgIds.has(p.organizationId));

  const handleAdd = () => {
    const orgId = Number(selectedOrgId);
    if (!orgId || Number.isNaN(orgId)) {
      toast.error("Select a provider to add.");
      return;
    }
    addMutation.mutate(
      { providerOrganizationId: orgId },
      {
        onSuccess: () => {
          toast.success("Provider linked.");
          setSelectedOrgId("");
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to add."),
      }
    );
  };

  const handleRemove = (linkId: number, name: string) => {
    if (!confirm(`Remove ${name || "this provider"} from linked providers?`)) return;
    removeMutation.mutate(linkId, {
      onSuccess: () => toast.success("Provider removed."),
      onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to remove."),
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <Link to="/station-requests">
          <ChevronLeft className="h-4 w-4" />
          Back to External Requests
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Linked Service Providers</h1>
        <p className="text-muted-foreground">
          Manage service providers linked to your station for sending maintenance requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add provider
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Only approved providers not already linked appear below.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 items-end">
          <div className="min-w-[200px]">
            <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose provider" />
              </SelectTrigger>
              <SelectContent>
                {canAdd.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No available providers
                  </SelectItem>
                ) : (
                  canAdd.map((p) => (
                    <SelectItem key={p.organizationId} value={String(p.organizationId)}>
                      {p.organizationName ?? `Organization #${p.organizationId}`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            className="gap-1"
            onClick={handleAdd}
            disabled={addMutation.isPending || !selectedOrgId || selectedOrgId === "_none"}
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked providers ({linked.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : linked.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No linked providers. Add one above to send requests to them.
            </p>
          ) : (
            <ul className="space-y-2">
              {linked.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {p.organizationName ?? `Organization #${p.organizationId}`}
                    </span>
                    {p.status && (
                      <Badge variant="secondary" className="text-xs">
                        {p.status}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive gap-1"
                    onClick={() => handleRemove(p.id, p.organizationName ?? "")}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
