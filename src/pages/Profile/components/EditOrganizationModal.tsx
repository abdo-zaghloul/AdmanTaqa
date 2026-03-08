import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUpdataOrganization from "@/hooks/Organization/useUpdataOrganization";
import useCreateServiceProviderProfile from "@/hooks/Organization/useCreateServiceProviderProfile";
import useUpdateServiceProviderProfile from "@/hooks/Organization/useUpdateServiceProviderProfile";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useGetAreas from "@/hooks/Location/useGetAreas";
import type {
  ServiceProviderProfileBody,
  OrganizationMeFullServiceProviderProfile,
} from "@/types/organization";

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  organizationType?: string;
  organizationId?: number;
  initialServiceProviderProfile?: OrganizationMeFullServiceProviderProfile | null;
}

export default function EditOrganizationModal({
  isOpen,
  onClose,
  currentName,
  organizationType,
  organizationId,
  initialServiceProviderProfile,
}: EditOrganizationModalProps) {
  const [name, setName] = useState(currentName);
  const [spForm, setSpForm] = useState<ServiceProviderProfileBody>({
    licenseNumber: "",
    yearsExperience: undefined,
    areaId: undefined,
    cityId: undefined,
    street: "",
    serviceCategories: [],
  });
  const [countryId, setCountryId] = useState<number | null>(null);
  const [governorateId, setGovernorateId] = useState<number | null>(null);

  const updateOrgMutation = useUpdataOrganization();
  const createSPMutation = useCreateServiceProviderProfile();
  const updateSPMutation = useUpdateServiceProviderProfile();

  const countries = useGetCountries().data?.data ?? [];
  const governorates = useGetGovernorates(countryId).data?.data ?? [];
  const cities = useGetCities(governorateId).data?.data ?? [];
  const areas = useGetAreas(spForm.cityId ?? null).data?.data ?? [];

  const isServiceProvider = organizationType === "SERVICE_PROVIDER";
  const hasSPProfile = !!initialServiceProviderProfile?.id;

  useEffect(() => {
    setName(currentName);
  }, [currentName, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (initialServiceProviderProfile) {
      setSpForm({
        licenseNumber: initialServiceProviderProfile.licenseNumber ?? "",
        yearsExperience: initialServiceProviderProfile.yearsExperience ?? undefined,
        areaId: initialServiceProviderProfile.areaId ?? undefined,
        cityId: initialServiceProviderProfile.cityId ?? undefined,
        street: initialServiceProviderProfile.street ?? "",
        serviceCategories: initialServiceProviderProfile.serviceCategories ?? [],
      });
    } else {
      setSpForm({
        licenseNumber: "",
        yearsExperience: undefined,
        areaId: undefined,
        cityId: undefined,
        street: "",
        serviceCategories: [],
      });
    }
    setCountryId(null);
    setGovernorateId(null);
  }, [isOpen, initialServiceProviderProfile]);

  const nameChanged = name.trim() !== currentName;

  const saveSP = () => {
    if (!isServiceProvider || !organizationId) {
      onClose();
      return;
    }
    const body: ServiceProviderProfileBody = {
      ...spForm,
      serviceCategories: Array.isArray(spForm.serviceCategories) ? spForm.serviceCategories : [],
    };
    if (hasSPProfile) {
      updateSPMutation.mutate(
        { organizationId, body },
        {
          onSuccess: () => onClose(),
          onError: (e) => {},
        }
      );
    } else {
      createSPMutation.mutate(
        { organizationId, body },
        {
          onSuccess: () => onClose(),
          onError: (e) => {},
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameChanged) {
      updateOrgMutation.mutate(
        { name: name.trim() },
        {
          onSuccess: () => {
            if (isServiceProvider) saveSP();
            else onClose();
          },
          onError: () => {},
        }
      );
    } else {
      if (isServiceProvider) saveSP();
      else onClose();
    }
  };

  const pending =
    updateOrgMutation.isPending || createSPMutation.isPending || updateSPMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your organization and service provider details in one place.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Organization Name */}
            <div className="grid gap-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter organization name"
              />
            </div>

            {/* Service Provider Profile section */}
            {isServiceProvider && (
              <>
                <hr className="my-2" />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Service Provider Profile</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>License Number</Label>
                      <Input
                        value={spForm.licenseNumber ?? ""}
                        onChange={(e) =>
                          setSpForm((p) => ({ ...p, licenseNumber: e.target.value }))
                        }
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label>Years Experience</Label>
                      <Input
                        type="number"
                        min={0}
                        value={spForm.yearsExperience ?? ""}
                        onChange={(e) =>
                          setSpForm((p) => ({
                            ...p,
                            yearsExperience: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Country</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={countryId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value ? Number(e.target.value) : null;
                          setCountryId(v);
                          setGovernorateId(null);
                          setSpForm((p) => ({ ...p, cityId: undefined, areaId: undefined }));
                        }}
                      >
                        <option value="">Select</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Governorate</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={governorateId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value ? Number(e.target.value) : null;
                          setGovernorateId(v);
                          setSpForm((p) => ({ ...p, cityId: undefined, areaId: undefined }));
                        }}
                      >
                        <option value="">Select</option>
                        {governorates.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={spForm.cityId ?? ""}
                        onChange={(e) =>
                          setSpForm((p) => ({
                            ...p,
                            cityId: e.target.value ? Number(e.target.value) : undefined,
                            areaId: undefined,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Area</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={spForm.areaId ?? ""}
                        onChange={(e) =>
                          setSpForm((p) => ({
                            ...p,
                            areaId: e.target.value ? Number(e.target.value) : undefined,
                          }))
                        }
                      >
                        <option value="">Select</option>
                        {areas.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Street</Label>
                    <Input
                      value={spForm.street ?? ""}
                      onChange={(e) => setSpForm((p) => ({ ...p, street: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Service Categories (comma-separated)</Label>
                    <Input
                      value={
                        Array.isArray(spForm.serviceCategories)
                          ? spForm.serviceCategories.join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        setSpForm((p) => ({
                          ...p,
                          serviceCategories: e.target.value
                            ? e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                            : [],
                        }))
                      }
                      placeholder="e.g. maintenance, repair"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
