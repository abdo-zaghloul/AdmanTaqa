import { useState } from "react";
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
import { Wrench, Plus } from "lucide-react";
import { toast } from "sonner";
import useGetServiceProviderProfile from "@/hooks/Organization/useGetServiceProviderProfile";
import useCreateServiceProviderProfile from "@/hooks/Organization/useCreateServiceProviderProfile";
import useUpdateServiceProviderProfile from "@/hooks/Organization/useUpdateServiceProviderProfile";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useGetAreas from "@/hooks/Location/useGetAreas";
import type { ServiceProviderProfileBody } from "@/types/organization";

interface ProfileServiceProviderProfileCardProps {
  organizationId: number;
  /** When true, render content only without Card wrapper (for use inside UnifiedProfileCard) */
  embedded?: boolean;
}

export default function ProfileServiceProviderProfileCard({ organizationId, embedded }: ProfileServiceProviderProfileCardProps) {
  const { data: profile, isLoading: profileLoading } = useGetServiceProviderProfile(organizationId);
  const createMutation = useCreateServiceProviderProfile();
  const updateMutation = useUpdateServiceProviderProfile();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
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

  if (profileLoading) {
    if (embedded) return <div className="border-t pt-6"><p className="text-sm text-muted-foreground">Loading profile...</p></div>;
    return (
      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  const sectionHeader = (
    <div className="flex flex-row items-start justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Service Provider</h2>
        <CardTitle className="text-lg flex items-center gap-2 font-medium">
          <Wrench className="h-5 w-5" />
          Service Provider Profile
        </CardTitle>
        <CardDescription>License, experience, address, and profile documents.</CardDescription>
      </div>
      {!showForm && !profile && (
        <Button size="sm" onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-1" /> Create Profile
        </Button>
      )}
    </div>
  );

  const sectionContent = (
    <>
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
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No service provider profile yet. Create one to add license, address, and profile documents.
          </p>
        )}
    </>
  );

  if (embedded) {
    return (
      <>
        <div className="border-t pt-6 space-y-6">
          {sectionHeader}
          {sectionContent}
        </div>
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
      </>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="border-b bg-muted/30 pb-4">
        {sectionHeader}
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {sectionContent}
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
    </Card>
  );
}
