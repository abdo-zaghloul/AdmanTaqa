import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Building2, ShieldCheck, CalendarDays, Wrench, User } from "lucide-react";
import type { OrganizationMeFullData } from "@/types/organization";

interface OrganizationDetailsCardProps {
    organization: OrganizationMeFullData | null | undefined;
    /** When true, render only content (Account Type, Member Since, SP summary) without Card wrapper or org header */
    embedded?: boolean;
}

const organizationDetailsContent = (organization: OrganizationMeFullData | null | undefined) => (
                <div className="grid gap-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-background border space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4" />
                                    <Label className="text-xs uppercase font-semibold">Account Type</Label>
                                </div>
                                <p className="font-medium">{organization?.type}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-background border space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="h-4 w-4" />
                                    <Label className="text-xs uppercase font-semibold">Member Since</Label>
                                </div>
                                <p className="text-sm">
                                    {organization?.createdAt ? new Date(organization.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {organization?.owner && (
                        <div className="border-t pt-6 space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                <Label className="text-xs uppercase font-semibold">Owner</Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Full Name</p>
                                    <p className="font-medium">{organization.owner.fullName ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                                    <p className="font-medium">{organization.owner.email ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                                    <p className="font-medium">{organization.owner.phone ?? "—"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {organization?.type === "SERVICE_PROVIDER" && organization?.ServiceProviderProfile && (
                        <div className="border-t pt-6 space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Wrench className="h-4 w-4" />
                                <Label className="text-xs uppercase font-semibold">Service Provider Profile</Label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">License Number</p>
                                    <p className="font-medium">{organization.ServiceProviderProfile.licenseNumber ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Years Experience</p>
                                    <p className="font-medium">{organization.ServiceProviderProfile.yearsExperience ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Area</p>
                                    <p className="font-medium">{organization.ServiceProviderProfile.Area?.name ?? organization.ServiceProviderProfile.areaId ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">City</p>
                                    <p className="font-medium">{organization.ServiceProviderProfile.City?.name ?? organization.ServiceProviderProfile.cityId ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5 md:col-span-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Street</p>
                                    <p className="font-medium">{organization.ServiceProviderProfile.street ?? "—"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-background border space-y-0.5 md:col-span-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Service Categories</p>
                                    <p className="font-medium">
                                        {Array.isArray(organization.ServiceProviderProfile.serviceCategories) && organization.ServiceProviderProfile.serviceCategories.length
                                            ? organization.ServiceProviderProfile.serviceCategories.join(", ")
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
);

export default function OrganizationDetailsCard({ organization, embedded }: OrganizationDetailsCardProps) {
    if (embedded) {
        return <div className="space-y-6">{organizationDetailsContent(organization)}</div>;
    }
    return (
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="border-b bg-muted/30 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">{organization?.name}</CardTitle>
                            <CardDescription>{organization?.type}</CardDescription>
                        </div>
                    </div>
                    {organization?.status && (
                        <Badge className="px-3 py-1 text-xs" variant={organization.status === "APPROVED" ? "default" : "secondary"}>
                            {organization.status}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {organizationDetailsContent(organization)}
            </CardContent>
        </Card>
    );
}
