import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const linkedOrgIds = new Set(linked.map((p) => p.organizationId));
  const canAdd = available.filter((p) => !linkedOrgIds.has(p.organizationId));

  const handleAdd = (orgId: number) => {
    addMutation.mutate(
      { providerOrganizationId: orgId },
      {
        onSuccess: () => toast.success("Provider linked."),
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
          Back to Station Requests
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Linked Service Providers</h1>
        <p className="text-muted-foreground">
          Manage service providers linked to your station. Linked providers are shown below; choose one to remove or add from available providers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Linked providers ({linked.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Providers already linked to your station. You can remove them below.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : linked.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No linked providers. Add one from the &quot;Available providers&quot; section below.
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Available providers to add
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a provider from the list and click Add to link them to your station.
          </p>
        </CardHeader>
        <CardContent>
          {canAdd.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No available providers to add (all are already linked).
            </p>
          ) : (
            <ul className="space-y-2">
              {canAdd.map((p) => (
                <li
                  key={p.organizationId}
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
                    size="sm"
                    className="gap-1"
                    onClick={() => handleAdd(p.organizationId)}
                    disabled={addMutation.isPending}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add
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
