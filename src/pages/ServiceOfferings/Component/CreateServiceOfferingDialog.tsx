import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import useGetServiceCategories from "@/hooks/ServiceCategories/useGetServiceCategories";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useCreateServiceOffering from "@/hooks/ServiceOfferings/useCreateServiceOffering";

type OfferingForm = {
  serviceCategoryId: string;
  governorateId: string;
  cityId: string;
  amount: string;
  currency: string;
};

const initialCreateForm: OfferingForm = {
  serviceCategoryId: "",
  governorateId: "",
  cityId: "",
  amount: "",
  currency: "SAR",
};

type CreateServiceOfferingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: number | null | undefined;
};

export default function CreateServiceOfferingDialog({
  open,
  onOpenChange,
  organizationId,
}: CreateServiceOfferingDialogProps) {
  const [form, setForm] = useState<OfferingForm>(initialCreateForm);
  const [countryId, setCountryId] = useState<string>("");
  const createMutation = useCreateServiceOffering();

  const { data: categoriesResponse } = useGetServiceCategories();
  const categories = categoriesResponse ?? [];
  const approvedCategories = useMemo(
    () => categories.filter((c) => c.status === "APPROVED"),
    [categories]
  );
  const { data: countriesResponse } = useGetCountries();
  const countries = countriesResponse?.data ?? [];
  const selectedCountryId = countryId ? Number(countryId) : null;

  // Default to Saudi Arabia and SAR when dialog opens for Service Offerings
  useEffect(() => {
    if (!open || countries.length === 0 || countryId) return;
    const saudi = countries.find(
      (c) =>
        (c.name && (c.name.includes("Saudi") || c.name.includes("السعود") || c.name.includes("Kingdom"))) ||
        (c.code && (c.code === "SA" || c.code === "SAU"))
    );
    if (saudi) {
      setCountryId(String(saudi.id));
      setForm((p) => ({ ...p, currency: "SAR" }));
    }
  }, [open, countries, countryId]);
  const { data: governoratesResponse } = useGetGovernorates(selectedCountryId);
  const governorates = governoratesResponse?.data ?? [];
  const createGovernorateNum = form.governorateId
    ? Number(form.governorateId)
    : null;
  const { data: createCitiesResponse } = useGetCities(createGovernorateNum);
  const createCities = createCitiesResponse?.data ?? [];

  const canSubmit = useMemo(
    () =>
      !!organizationId &&
      !!form.serviceCategoryId &&
      !!form.governorateId &&
      !!form.cityId &&
      !!form.amount &&
      !createMutation.isPending,
    [organizationId, form, createMutation.isPending]
  );

  const resetAndClose = () => {
    setForm(initialCreateForm);
    setCountryId("");
    onOpenChange(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }
    createMutation.mutate(
      {
        organizationId,
        body: {
          serviceCategoryId: Number(form.serviceCategoryId),
          governorateId: Number(form.governorateId),
          cityId: Number(form.cityId),
          amount,
          currency: form.currency || "SAR",
        },
      },
      {
        onSuccess: () => {
          toast.success("Service offering created.");
          resetAndClose();
        },
        onError: (err) =>
          toast.error((err as Error)?.message ?? "Failed to create offering."),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Service Offering</DialogTitle>
          <DialogDescription>
            Add fixed pricing for a service category in a specific city and governorate.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleCreate}>
      
          <Select
            value={
              approvedCategories.some((c) => String(c.id) === form.serviceCategoryId)
                ? form.serviceCategoryId
                : ""
            }
            onValueChange={(v) =>
              setForm((p) => ({ ...p, serviceCategoryId: v }))
            }
            disabled={approvedCategories.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
              {approvedCategories.length === 0 ? (
                <div className="py-2 px-2 text-sm text-muted-foreground">
                  No approved service categories available.
                </div>
              ) : (
                approvedCategories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.nameEn ?? cat.nameAr ?? cat.name ?? `Category ${cat.id}`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {approvedCategories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No approved service categories available. Only approved categories can be used for offerings.
            </p>
          )}
          <Select
            value={countryId}
            onValueChange={(v) => {
              setCountryId(v);
              setForm((p) => ({ ...p, governorateId: "", cityId: "" }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            {/* console.log() */}
            
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={String(country.id)}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.governorateId}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, governorateId: v, cityId: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select governorate" />
            </SelectTrigger>
            <SelectContent>
              {governorates.map((gov) => (
                <SelectItem key={gov.id} value={String(gov.id)}>
                  {gov.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.cityId}
            onValueChange={(v) => setForm((p) => ({ ...p, cityId: v }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {createCities.map((city) => (
                <SelectItem key={city.id} value={String(city.id)}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount (e.g. 99.5)"
            value={form.amount}
            onChange={(e) =>
              setForm((p) => ({ ...p, amount: e.target.value }))
            }
          />

          <Input
            maxLength={3}
            placeholder="Currency (default SAR)"
            value={form.currency}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                currency: e.target.value.toUpperCase(),
              }))
            }
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetAndClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
