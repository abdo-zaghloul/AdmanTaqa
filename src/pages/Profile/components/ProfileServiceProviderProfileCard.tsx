import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wrench, Plus, Pencil, Trash2, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import useGetServiceProviderProfile from "@/hooks/Organization/useGetServiceProviderProfile";
import useCreateServiceProviderProfile from "@/hooks/Organization/useCreateServiceProviderProfile";
import useUpdateServiceProviderProfile from "@/hooks/Organization/useUpdateServiceProviderProfile";
import useDeleteServiceProviderProfile from "@/hooks/Organization/useDeleteServiceProviderProfile";
import useGetServiceProviderProfileDocuments from "@/hooks/Organization/useGetServiceProviderProfileDocuments";
import useUploadServiceProviderProfileDocument from "@/hooks/Organization/useUploadServiceProviderProfileDocument";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useGetAreas from "@/hooks/Location/useGetAreas";
import type {
  ServiceProviderProfileBody,
  ServiceProviderProfileDocumentType,
  ServiceProviderProfileDocument,
} from "@/types/organization";

const PROFILE_DOC_TYPES: { value: ServiceProviderProfileDocumentType; label: string }[] = [
  { value: "COMMERCIAL_REGISTRATION", label: "Commercial Registration" },
  { value: "TAX_CERTIFICATE", label: "Tax Certificate" },
  { value: "TECHNICAL_CERTIFICATE", label: "Technical Certificate" },
  { value: "INSURANCE_CERTIFICATE", label: "Insurance Certificate" },
];

interface ProfileServiceProviderProfileCardProps {
  organizationId: number;
}

export default function ProfileServiceProviderProfileCard({ organizationId }: ProfileServiceProviderProfileCardProps) {
  const { data: profile, isLoading: profileLoading } = useGetServiceProviderProfile(organizationId);
  const { data: profileDocs = [], isLoading: docsLoading } =
    useGetServiceProviderProfileDocuments(organizationId, !!profile);
  const createMutation = useCreateServiceProviderProfile();
  const updateMutation = useUpdateServiceProviderProfile();
  const deleteMutation = useDeleteServiceProviderProfile();
  const uploadDocMutation = useUploadServiceProviderProfileDocument();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState<ServiceProviderProfileBody>({
    licenseNumber: "",
    yearsExperience: undefined,
    areaId: undefined,
    cityId: undefined,
    street: "",
    serviceCategories: [],
  });
  const [countryId, setCountryId] = useState<number | null>(null);
  const [governorateId, setGovernorateId] = useState<number | null>(null);
  const [profileDocType, setProfileDocType] = useState<ServiceProviderProfileDocumentType>("COMMERCIAL_REGISTRATION");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const countries = useGetCountries().data?.data ?? [];
  const governorates = useGetGovernorates(countryId).data?.data ?? [];
  const cities = useGetCities(governorateId).data?.data ?? [];
  const areas = useGetAreas(form.cityId ?? null).data?.data ?? [];

  const openCreateForm = () => {
    setForm({
      licenseNumber: "",
      yearsExperience: undefined,
      areaId: undefined,
      cityId: undefined,
      street: "",
      serviceCategories: [],
    });
    setCountryId(null);
    setGovernorateId(null);
    setShowForm(true);
    setEditing(false);
  };

  const openEditForm = () => {
    if (!profile) return;
    setForm({
      licenseNumber: profile.licenseNumber ?? "",
      yearsExperience: profile.yearsExperience ?? undefined,
      areaId: profile.areaId ?? undefined,
      cityId: profile.cityId ?? undefined,
      street: profile.street ?? "",
      serviceCategories: profile.serviceCategories ?? [],
    });
    setShowForm(true);
    setEditing(true);
  };

  const submitForm = () => {
    const body: ServiceProviderProfileBody = {
      ...form,
      serviceCategories: Array.isArray(form.serviceCategories) ? form.serviceCategories : [],
    };
    if (editing) {
      updateMutation.mutate(
        { organizationId, body },
        {
          onSuccess: () => {
            toast.success("Profile updated.");
            setShowForm(false);
          },
          onError: (e) => toast.error((e as Error)?.message ?? "Update failed."),
        }
      );
    } else {
      createMutation.mutate(
        { organizationId, body },
        {
          onSuccess: () => {
            toast.success("Profile created.");
            setShowForm(false);
          },
          onError: (e) => toast.error((e as Error)?.message ?? "Create failed."),
        }
      );
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(organizationId, {
      onSuccess: () => {
        toast.success("Profile deleted. All profile documents were removed.");
        setShowDeleteConfirm(false);
      },
      onError: (e) => toast.error((e as Error)?.message ?? "Delete failed."),
    });
  };

  const handleUploadDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadDocMutation.mutate(
      { organizationId, file, documentType: profileDocType },
      {
        onSuccess: () => {
          toast.success("Document uploaded.");
          e.target.value = "";
        },
        onError: (err) => toast.error((err as Error)?.message ?? "Upload failed."),
      }
    );
  };

  const getDocUrl = (doc: ServiceProviderProfileDocument) =>
    doc.url ?? doc.fileUrl ?? "#";

  if (profileLoading) {
    return (
      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="border-b bg-muted/30 pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Service Provider Profile
          </CardTitle>
          <CardDescription>License, experience, address, and profile documents.</CardDescription>
        </div>
        {!showForm && (
          <div className="flex gap-2">
            {profile ? (
              <>
                <Button variant="outline" size="sm" onClick={openEditForm}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={openCreateForm}>
                <Plus className="h-4 w-4 mr-1" /> Create Profile
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {profile ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">License Number</p>
                <p className="font-medium">{profile.licenseNumber ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Years Experience</p>
                <p className="font-medium">{profile.yearsExperience ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Area</p>
                <p className="font-medium">{profile.Area?.name ?? profile.areaId ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">City</p>
                <p className="font-medium">{profile.City?.name ?? profile.cityId ?? "—"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Street</p>
                <p className="font-medium">{profile.street ?? "—"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Service Categories</p>
                <p className="font-medium">
                  {Array.isArray(profile.serviceCategories) && profile.serviceCategories.length
                    ? profile.serviceCategories.join(", ")
                    : "—"}
                </p>
              </div>
            </div>
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Profile Documents
              </h4>
              <div className="flex flex-wrap items-end gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={profileDocType}
                    onChange={(e) => setProfileDocType(e.target.value as ServiceProviderProfileDocumentType)}
                  >
                    {PROFILE_DOC_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleUploadDoc}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadDocMutation.isPending}>
                  <Upload className="h-4 w-4 mr-2" /> {uploadDocMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {docsLoading ? (
                <p className="text-sm text-muted-foreground">Loading documents...</p>
              ) : profileDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No profile documents yet.</p>
              ) : (
                <ul className="space-y-2">
                  {profileDocs.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                      <span className="font-medium">{doc.fileName ?? doc.documentType ?? "Document"}</span>
                      <a href={getDocUrl(doc)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">View</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No service provider profile yet. Create one to add license, address, and profile documents.
          </p>
        )}
      </CardContent>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Profile" : "Create Profile"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update your service provider profile." : "Add license, experience, and address (all optional)."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>License Number</Label>
                <Input value={form.licenseNumber ?? ""} onChange={(e) => setForm((p) => ({ ...p, licenseNumber: e.target.value }))} placeholder="Optional" />
              </div>
              <div>
                <Label>Years Experience</Label>
                <Input type="number" min={0} value={form.yearsExperience ?? ""} onChange={(e) => setForm((p) => ({ ...p, yearsExperience: e.target.value ? Number(e.target.value) : undefined }))} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Country</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={countryId ?? ""} onChange={(e) => { const v = e.target.value ? Number(e.target.value) : null; setCountryId(v); setGovernorateId(null); setForm((p) => ({ ...p, cityId: undefined, areaId: undefined })); }}>
                  <option value="">Select</option>
                  {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Governorate</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={governorateId ?? ""} onChange={(e) => { const v = e.target.value ? Number(e.target.value) : null; setGovernorateId(v); setForm((p) => ({ ...p, cityId: undefined, areaId: undefined })); }}>
                  <option value="">Select</option>
                  {governorates.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.cityId ?? ""} onChange={(e) => setForm((p) => ({ ...p, cityId: e.target.value ? Number(e.target.value) : undefined, areaId: undefined }))}>
                  <option value="">Select</option>
                  {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Area</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.areaId ?? ""} onChange={(e) => setForm((p) => ({ ...p, areaId: e.target.value ? Number(e.target.value) : undefined }))}>
                  <option value="">Select</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Street</Label>
              <Input value={form.street ?? ""} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} placeholder="Optional" />
            </div>
            <div>
              <Label>Service Categories (comma-separated)</Label>
              <Input value={Array.isArray(form.serviceCategories) ? form.serviceCategories.join(", ") : ""} onChange={(e) => setForm((p) => ({ ...p, serviceCategories: e.target.value ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean) : [] }))} placeholder="e.g. Maintenance, Inspection" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={submitForm} disabled={createMutation.isPending || updateMutation.isPending}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service Provider Profile</DialogTitle>
            <DialogDescription>
              This will delete the profile and all associated documents (commercial registration, tax certificate, technical certificate, insurance). This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
