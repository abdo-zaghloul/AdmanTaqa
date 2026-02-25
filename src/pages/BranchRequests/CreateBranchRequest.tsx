import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import PendingApprovalGuard from "@/components/PendingApprovalGuard";
import useCreateBranchRequest from "@/hooks/BranchRequests/useCreateBranchRequest";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useGetAreas from "@/hooks/Location/useGetAreas";
import useGetFuelStationTypes from "@/hooks/Branches/useGetFuelStationTypes";
import useGetFuelTypes from "@/hooks/Branches/useGetFuelTypes";

export default function CreateBranchRequest() {
  const navigate = useNavigate();
  const createMutation = useCreateBranchRequest();
  const { data: orgResponse, isLoading: orgLoading } = useGetOrganization();
  const organization = orgResponse?.data;
  const isFuelStation = organization?.type === "FUEL_STATION";

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [stationTypeId, setStationTypeId] = useState("");
  const [street, setStreet] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [createManagerAccount, setCreateManagerAccount] = useState(false);
  const [countryId, setCountryId] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [selectedFuelTypeIds, setSelectedFuelTypeIds] = useState<number[]>([]);

  const { data: countriesRes } = useGetCountries();
  const { data: governoratesRes } = useGetGovernorates(
    countryId ? parseInt(countryId, 10) : null
  );
  const { data: citiesRes } = useGetCities(
    governorateId ? parseInt(governorateId, 10) : null
  );
  const { data: areasRes } = useGetAreas(cityId ? parseInt(cityId, 10) : null);
  const { data: stationTypes = [] } = useGetFuelStationTypes();
  const { data: fuelTypes = [] } = useGetFuelTypes();

  const countries = countriesRes?.data ?? [];
  const governorates = governoratesRes?.data ?? [];
  const cities = citiesRes?.data ?? [];
  const areas = areasRes?.data ?? [];

  const canSubmit = useMemo(
    () => isFuelStation && nameEn.trim() && nameAr.trim() && areaId,
    [isFuelStation, nameEn, nameAr, areaId]
  );

  const toggleFuelType = (id: number) => {
    setSelectedFuelTypeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const areaIdNum = Number(areaId);
    if (!areaIdNum) {
      toast.error("Area is required.");
      return;
    }

    createMutation.mutate(
      {
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim(),
        areaId: areaIdNum,
        stationTypeId: stationTypeId ? Number(stationTypeId) : undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        street: street.trim() || undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        address: address.trim() || undefined,
        ownerName: ownerName.trim() || undefined,
        ownerEmail: ownerEmail.trim() || undefined,
        managerName: managerName.trim() || undefined,
        managerEmail: managerEmail.trim() || undefined,
        managerPhone: managerPhone.trim() || undefined,
        createManagerAccount,
        fuelTypeIds: selectedFuelTypeIds.length ? selectedFuelTypeIds : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Branch request submitted.");
          navigate("/branch-requests");
        },
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Failed to submit request."),
      }
    );
  };

  return (
    <PendingApprovalGuard organization={organization} isLoading={orgLoading}>
      <div className="p-4 md:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Branch Request</h1>
          <p className="text-muted-foreground">
            Fuel Station can submit a request for Authority review.
          </p>
        </div>
        {!isFuelStation ? (
          <Card className="p-6 text-sm text-muted-foreground">
            This page is available for Fuel Station organizations only.
          </Card>
        ) : (
          <Card className="p-6 border-none shadow-xl bg-card/60 backdrop-blur-md">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name (EN) *</Label>
                  <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Name (AR) *</Label>
                  <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Station Type</Label>
                  <Select value={stationTypeId} onValueChange={setStationTypeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select station type" />
                    </SelectTrigger>
                    <SelectContent>
                      {stationTypes.map((st) => (
                        <SelectItem key={st.id} value={String(st.id)}>
                          {st.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={countryId}
                    onValueChange={(v) => {
                      setCountryId(v);
                      setGovernorateId("");
                      setCityId("");
                      setAreaId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Governorate</Label>
                  <Select
                    value={governorateId}
                    onValueChange={(v) => {
                      setGovernorateId(v);
                      setCityId("");
                      setAreaId("");
                    }}
                    disabled={!countryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select governorate" />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select
                    value={cityId}
                    onValueChange={(v) => {
                      setCityId(v);
                      setAreaId("");
                    }}
                    disabled={!governorateId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Area *</Label>
                  <Select value={areaId} onValueChange={setAreaId} disabled={!cityId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Street</Label>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Owner Email</Label>
                  <Input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Manager Name</Label>
                  <Input
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Manager Email</Label>
                  <Input
                    type="email"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Manager Phone</Label>
                <Input
                  value={managerPhone}
                  onChange={(e) => setManagerPhone(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={createManagerAccount}
                  onCheckedChange={(v) => setCreateManagerAccount(!!v)}
                />
                <p className="text-sm">Create manager account</p>
              </div>

              <div className="space-y-2">
                <Label>Fuel Types</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {fuelTypes.map((ft) => (
                    <label
                      key={ft.id}
                      className="flex items-center gap-2 rounded border p-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedFuelTypeIds.includes(ft.id)}
                        onCheckedChange={() => toggleFuelType(ft.id)}
                      />
                      <span>{ft.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/branch-requests")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!canSubmit || createMutation.isPending}>
                  {createMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </PendingApprovalGuard>
  );
}
