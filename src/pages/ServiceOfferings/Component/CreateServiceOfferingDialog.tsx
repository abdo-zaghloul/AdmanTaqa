import { useMemo, useState } from "react";
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
  currency: "USD",
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
  // console.log(categories);/
  const { data: countriesResponse } = useGetCountries();
  console.log(countriesResponse);
  const countries = countriesResponse?.data ?? [];
  const selectedCountryId = countryId ? Number(countryId) : null;
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
          currency: form.currency || "USD",
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
            value={form.serviceCategoryId}
            onValueChange={(v) =>
              setForm((p) => ({ ...p, serviceCategoryId: v }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
               {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            placeholder="Currency (default USD)"
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
