import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tag, Plus, Trash2 } from "lucide-react";
import useGetOrganizationServiceCategories from "@/hooks/Organization/useGetOrganizationServiceCategories";
import useGetServiceCategories from "@/hooks/ServiceCategories/useGetServiceCategories";
import useAddOrganizationServiceCategory from "@/hooks/Organization/useAddOrganizationServiceCategory";
import useRemoveOrganizationServiceCategory from "@/hooks/Organization/useRemoveOrganizationServiceCategory";
import type { ServiceCategory } from "@/types/organization";
import { toast } from "sonner";

interface ProfileServiceCategoriesCardProps {
    organizationId: number;
}

export default function ProfileServiceCategoriesCard({ organizationId }: ProfileServiceCategoriesCardProps) {
    const { data: linkedCategories = [], isLoading } = useGetOrganizationServiceCategories(organizationId);
    const { data: allCategories = [], isLoading: allLoading } = useGetServiceCategories();
    const addMutation = useAddOrganizationServiceCategory();
    const removeMutation = useRemoveOrganizationServiceCategory();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const linkedIds = new Set(linkedCategories.map((c) => c.id));
    const availableToAdd = allCategories.filter((c) => !linkedIds.has(c.id));

    const handleAdd = () => {
        const id = Number(selectedCategoryId);
        if (!id) return;
        addMutation.mutate(
            { organizationId, categoryId: id },
            {
                onSuccess: () => {
                    toast.success("Category linked.");
                    setSelectedCategoryId("");
                },
                onError: (err) =>
                    toast.error((err as Error)?.message ?? "Failed to add category."),
            }
        );
    };

    const handleRemove = (categoryId: number) => {
        removeMutation.mutate(
            { organizationId, categoryId },
            {
                onSuccess: () => toast.success("Category unlinked."),
                onError: (err) =>
                    toast.error((err as Error)?.message ?? "Failed to remove category."),
            }
        );
    };

    return (
        <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="border-b bg-muted/30 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Service Categories
                </CardTitle>
                <CardDescription>
                    Link or unlink service categories to your organization.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-2">
                        <Label>Add category</Label>
                        <Select
                            value={selectedCategoryId}
                            onValueChange={setSelectedCategoryId}
                            disabled={allLoading || availableToAdd.length === 0}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableToAdd.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAdd}
                        disabled={!selectedCategoryId || addMutation.isPending}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Link
                    </Button>
                </div>
                {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading categories...</p>
                ) : linkedCategories.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No service categories linked yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {linkedCategories.map((cat: ServiceCategory) => (
                            <li
                                key={cat.id}
                                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                            >
                                <span className="font-medium">{cat.name}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleRemove(cat.id)}
                                    disabled={removeMutation.isPending}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
