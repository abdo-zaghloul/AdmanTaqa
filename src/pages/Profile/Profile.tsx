import { useState } from "react";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditOrganizationModal from "./components/EditOrganizationModal";
import OrganizationDetailsCard from "./components/OrganizationDetailsCard";

export default function Profile() {
    const { data: organizationResponse, isLoading } = useGetOrganization();
    const organization = organizationResponse?.data;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

            <OrganizationDetailsCard organization={organization} />

            <EditOrganizationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentName={organization?.name || ""}
            />
        </div>
    );
}
