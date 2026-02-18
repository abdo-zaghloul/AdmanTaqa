import { useState } from "react";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import { MoreVertical, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditOrganizationModal from "./components/EditOrganizationModal";
import OrganizationDetailsCard from "./components/OrganizationDetailsCard";
import ProfileDocumentsCard from "./components/ProfileDocumentsCard";
import ProfileApprovalHistoryCard from "./components/ProfileApprovalHistoryCard";
import ProfileServiceProviderProfileCard from "./components/ProfileServiceProviderProfileCard";

export default function Profile() {
    const { data: organizationResponse, isLoading } = useGetOrganization();
    const organization = organizationResponse?.data;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isPendingApproval = organization && organization.status !== "APPROVED";

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your organization's public identity and settings.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-10 w-10 rounded-full"
                >
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>

            {isPendingApproval && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-200">
                            Your organization is pending approval.
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            Operational features (service requests, quotations, job orders) are limited until your organization is approved.
                        </p>
                    </div>
                </div>
            )}

            <OrganizationDetailsCard organization={organization} />

            {organization?.id && (
                <>
                    <ProfileDocumentsCard organizationId={organization.id} />
                    <ProfileApprovalHistoryCard organizationId={organization.id} />
                    {organization?.type === "SERVICE_PROVIDER" && (
                        <ProfileServiceProviderProfileCard organizationId={organization.id} />
                    )}
                </>
            )}

            <EditOrganizationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentName={organization?.name || ""}
            />
        </div>
    );
}
