import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Building2, ShieldCheck, CalendarDays } from "lucide-react";

interface OrganizationDetailsCardProps {
    organization: any;
}

export default function OrganizationDetailsCard({ organization }: OrganizationDetailsCardProps) {
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
                </div>
            </CardContent>
        </Card>
    );
}
