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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tag, Plus, Trash2, Sparkles, Pencil, Check, X } from "lucide-react";
import useGetOrganizationServiceCategories from "@/hooks/Organization/useGetOrganizationServiceCategories";
import useGetServiceCategories from "@/hooks/ServiceCategories/useGetServiceCategories";
import useAddOrganizationServiceCategory from "@/hooks/Organization/useAddOrganizationServiceCategory";
import useRemoveOrganizationServiceCategory from "@/hooks/Organization/useRemoveOrganizationServiceCategory";
import useProposeServiceCategory from "@/hooks/ServiceCategories/useProposeServiceCategory";
import useCreateServiceCategory from "@/hooks/ServiceCategories/useCreateServiceCategory";
import useUpdateServiceCategory from "@/hooks/ServiceCategories/useUpdateServiceCategory";
import useApproveServiceCategory from "@/hooks/ServiceCategories/useApproveServiceCategory";
import useRejectServiceCategory from "@/hooks/ServiceCategories/useRejectServiceCategory";
import useGetServiceCategoryById from "@/hooks/ServiceCategories/useGetServiceCategoryById";
import type { ServiceCategory } from "@/types/serviceCategory";
import { toast } from "sonner";

interface ProfileServiceCategoriesCardProps {
    organizationId: number;
    organizationType: "FUEL_STATION" | "SERVICE_PROVIDER" | "AUTHORITY";
}

export default function ProfileServiceCategoriesCard({
    organizationId,
    organizationType,
}: ProfileServiceCategoriesCardProps) {
    const { data: linkedCategories = [], isLoading } = useGetOrganizationServiceCategories(organizationId);
    const { data: allCategories = [], isLoading: allLoading } = useGetServiceCategories();
    const addMutation = useAddOrganizationServiceCategory();
    const removeMutation = useRemoveOrganizationServiceCategory();
    const proposeMutation = useProposeServiceCategory();
    const createMutation = useCreateServiceCategory();
    const updateMutation = useUpdateServiceCategory();
    const approveMutation = useApproveServiceCategory();
    const rejectMutation = useRejectServiceCategory();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [proposeOpen, setProposeOpen] = useState(false);
    const [proposeNameEn, setProposeNameEn] = useState("");
    const [proposeNameAr, setProposeNameAr] = useState("");
    const [proposeCode, setProposeCode] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [createNameEn, setCreateNameEn] = useState("");
    const [createNameAr, setCreateNameAr] = useState("");
    const [createCode, setCreateCode] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ServiceCategory | null>(null);
    const [editNameEn, setEditNameEn] = useState("");
    const [editNameAr, setEditNameAr] = useState("");
    const [editCode, setEditCode] = useState("");
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<ServiceCategory | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [viewOpen, setViewOpen] = useState(false);
    const [viewId, setViewId] = useState<number | null>(null);
    const { data: viewedCategory, isLoading: viewingLoading } =
        useGetServiceCategoryById(viewId);

    const isAuthority = organizationType === "AUTHORITY";
    const isServiceProvider = organizationType === "SERVICE_PROVIDER";

    const linkedIds = new Set(linkedCategories.map((c) => c.id));
    const availableToAdd = allCategories.filter(
        (c) => !linkedIds.has(c.id) && c.status === "APPROVED"
    );
    const proposedByMe = allCategories.filter(
        (c) => c.proposedByOrganizationId === organizationId
    );

    const getCategoryLabel = (cat: ServiceCategory) =>
        cat.nameEn || cat.nameAr || cat.name || `Category #${cat.id}`;

    const getStatusBadgeVariant = (status?: ServiceCategory["status"]) => {
        if (status === "APPROVED") return "default";
        if (status === "REJECTED") return "destructive";
        return "secondary";
    };

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

    const openView = (id: number) => {
        setViewId(id);
        setViewOpen(true);
    };

    const openEdit = (cat: ServiceCategory) => {
        setEditTarget(cat);
        setEditNameEn(cat.nameEn ?? "");
        setEditNameAr(cat.nameAr ?? "");
        setEditCode(cat.code ?? "");
        setEditOpen(true);
    };

    const handleCreate = () => {
        if (!createNameEn.trim() || !createNameAr.trim()) {
            toast.error("English and Arabic names are required.");
            return;
        }
        createMutation.mutate(
            {
                nameEn: createNameEn.trim(),
                nameAr: createNameAr.trim(),
                code: createCode.trim() || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Category created.");
                    setCreateOpen(false);
                    setCreateNameEn("");
                    setCreateNameAr("");
                    setCreateCode("");
                },
                onError: (err) =>
                    toast.error((err as Error)?.message ?? "Failed to create category."),
            }
        );
    };

    const handleUpdate = () => {
        if (!editTarget) return;
        updateMutation.mutate(
            {
                id: editTarget.id,
                body: {
                    nameEn: editNameEn.trim() || undefined,
                    nameAr: editNameAr.trim() || undefined,
                    code: editCode.trim() || null,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Category updated.");
                    setEditOpen(false);
                    setEditTarget(null);
                },
                onError: (err) =>
                    toast.error((err as Error)?.message ?? "Failed to update category."),
            }
        );
    };

    const handleApprove = (cat: ServiceCategory) => {
        approveMutation.mutate(cat.id, {
            onSuccess: () => toast.success("Category approved."),
            onError: (err) =>
                toast.error((err as Error)?.message ?? "Failed to approve category."),
        });
    };

    const openReject = (cat: ServiceCategory) => {
        setRejectTarget(cat);
        setRejectReason("");
        setRejectOpen(true);
    };

    const handleReject = () => {
        if (!rejectTarget) return;
        rejectMutation.mutate(
            {
                id: rejectTarget.id,
                body: { reason: rejectReason.trim() || undefined },
            },
            {
                onSuccess: () => {
                    toast.success("Category rejected.");
                    setRejectOpen(false);
                    setRejectTarget(null);
                    setRejectReason("");
                },
                onError: (err) =>
                    toast.error((err as Error)?.message ?? "Failed to reject category."),
            }
        );
    };

    const handlePropose = () => {
        if (!proposeNameEn.trim() || !proposeNameAr.trim()) {
            toast.error("English and Arabic names are required.");
            return;
        }

        proposeMutation.mutate(
            {
                nameEn: proposeNameEn.trim(),
                nameAr: proposeNameAr.trim(),
                code: proposeCode.trim() || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Category proposal submitted.");
                    setProposeNameEn("");
                    setProposeNameAr("");
                    setProposeCode("");
                    setProposeOpen(false);
                },
                onError: (err) =>
                    toast.error((err as Error)?.message ?? "Failed to propose category."),
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
                    Browse categories and manage them based on organization type.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {isServiceProvider && (
                    <div className="flex flex-wrap items-end gap-3">
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
                                            {getCategoryLabel(c)}
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
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setProposeOpen(true)}
                        >
                            <Sparkles className="h-4 w-4 mr-1" />
                            Propose Category
                        </Button>
                    </div>
                )}

                {isAuthority && (
                    <div className="flex justify-end">
                        <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Create Category
                        </Button>
                    </div>
                )}

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
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{getCategoryLabel(cat)}</span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openView(cat.id)}
                                    >
                                        View
                                    </Button>
                                </div>
                                {isServiceProvider && (
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
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="border-t pt-4">
                    <p className="text-sm font-semibold mb-2">
                        {isAuthority ? "All Categories" : "My Proposed Categories"}
                    </p>
                    {allLoading ? (
                        <p className="text-sm text-muted-foreground">Loading proposals...</p>
                    ) : (isAuthority ? allCategories : proposedByMe).length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                            {isAuthority
                                ? "No categories found."
                                : "You did not propose categories yet."}
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {(isAuthority ? allCategories : proposedByMe).map((cat) => (
                                <li key={cat.id} className="rounded-lg border px-3 py-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">{getCategoryLabel(cat)}</p>
                                            <Badge variant={getStatusBadgeVariant(cat.status)}>
                                                {cat.status ?? "PENDING"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openView(cat.id)}
                                            >
                                                View
                                            </Button>
                                            {isAuthority && (
                                                <>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEdit(cat)}
                                                    >
                                                        <Pencil className="h-3 w-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                    {cat.status === "PENDING" && (
                                                        <>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleApprove(cat)}
                                                                disabled={approveMutation.isPending}
                                                            >
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => openReject(cat)}
                                                                disabled={rejectMutation.isPending}
                                                            >
                                                                <X className="h-3 w-3 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {cat.code && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Code: {cat.code}
                                        </p>
                                    )}
                                    {cat.status === "REJECTED" && cat.rejectedReason && (
                                        <p className="mt-1 text-xs text-destructive">
                                            Rejected reason: {cat.rejectedReason}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>

            <Dialog open={proposeOpen} onOpenChange={setProposeOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Propose Service Category</DialogTitle>
                        <DialogDescription>
                            Submit a new category for Authority review.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="propose-name-en">Name (English)</Label>
                            <Input
                                id="propose-name-en"
                                value={proposeNameEn}
                                onChange={(e) => setProposeNameEn(e.target.value)}
                                placeholder="Electrical Maintenance"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="propose-name-ar">Name (Arabic)</Label>
                            <Textarea
                                id="propose-name-ar"
                                value={proposeNameAr}
                                onChange={(e) => setProposeNameAr(e.target.value)}
                                placeholder="صيانة كهربائية"
                                className="min-h-[70px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="propose-code">Code (optional)</Label>
                            <Input
                                id="propose-code"
                                value={proposeCode}
                                onChange={(e) => setProposeCode(e.target.value)}
                                placeholder="ELEC_MAINT"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setProposeOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePropose}
                            disabled={proposeMutation.isPending}
                        >
                            {proposeMutation.isPending ? "Submitting..." : "Submit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Service Category</DialogTitle>
                        <DialogDescription>
                            Authority can create categories directly as approved.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name-en">Name (English)</Label>
                            <Input
                                id="create-name-en"
                                value={createNameEn}
                                onChange={(e) => setCreateNameEn(e.target.value)}
                                placeholder="Mechanical Services"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-name-ar">Name (Arabic)</Label>
                            <Textarea
                                id="create-name-ar"
                                value={createNameAr}
                                onChange={(e) => setCreateNameAr(e.target.value)}
                                placeholder="خدمات ميكانيكية"
                                className="min-h-[70px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-code">Code (optional)</Label>
                            <Input
                                id="create-code"
                                value={createCode}
                                onChange={(e) => setCreateCode(e.target.value)}
                                placeholder="MECH_SERV"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Service Category</DialogTitle>
                        <DialogDescription>
                            Update category names or code.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name-en">Name (English)</Label>
                            <Input
                                id="edit-name-en"
                                value={editNameEn}
                                onChange={(e) => setEditNameEn(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-name-ar">Name (Arabic)</Label>
                            <Textarea
                                id="edit-name-ar"
                                value={editNameAr}
                                onChange={(e) => setEditNameAr(e.target.value)}
                                className="min-h-[70px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-code">Code</Label>
                            <Input
                                id="edit-code"
                                value={editCode}
                                onChange={(e) => setEditCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Category</DialogTitle>
                        <DialogDescription>
                            Add optional reason for rejection.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="reject-reason">Reason</Label>
                        <Textarea
                            id="reject-reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="min-h-[90px]"
                            placeholder="Optional reason"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={rejectMutation.isPending}
                        >
                            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Category Details</DialogTitle>
                        <DialogDescription>
                            View category by id.
                        </DialogDescription>
                    </DialogHeader>
                    {viewingLoading ? (
                        <p className="text-sm text-muted-foreground">Loading details...</p>
                    ) : viewedCategory ? (
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">ID</span>
                                <span className="font-medium">{viewedCategory.id}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Name (EN)</span>
                                <span className="font-medium">{viewedCategory.nameEn ?? "—"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Name (AR)</span>
                                <span className="font-medium">{viewedCategory.nameAr ?? "—"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Code</span>
                                <span className="font-medium">{viewedCategory.code ?? "—"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant={getStatusBadgeVariant(viewedCategory.status)}>
                                    {viewedCategory.status ?? "PENDING"}
                                </Badge>
                            </div>
                            {viewedCategory.rejectedReason && (
                                <p className="text-destructive text-xs">
                                    Rejected reason: {viewedCategory.rejectedReason}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Category not found.</p>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
