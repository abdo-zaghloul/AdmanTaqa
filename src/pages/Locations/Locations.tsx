import { useState } from "react";
import useGetCountries from "@/hooks/Location/useGetCountries";
import useGetGovernorates from "@/hooks/Location/useGetGovernorates";
import useGetCities from "@/hooks/Location/useGetCities";
import useGetAreas from "@/hooks/Location/useGetAreas";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import LocationSelector from "./components/LocationSelector";

export default function Locations() {
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedGovernorateId, setSelectedGovernorateId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  // Queries
  const { data: countriesRes, isLoading: loadingCountries } = useGetCountries();
  const { data: governoratesRes, isLoading: loadingGovs } = useGetGovernorates(
    selectedCountryId ? parseInt(selectedCountryId) : null
  );

  const { data: citiesRes, isLoading: loadingCities } = useGetCities(
    selectedGovernorateId ? parseInt(selectedGovernorateId) : null
  );
  const { data: areasRes, isLoading: loadingAreas } = useGetAreas(
    selectedCityId ? parseInt(selectedCityId) : null
  );

  const countries = countriesRes?.data || [];
  const governorates = governoratesRes?.data || [];
  const cities = citiesRes?.data || [];
  const areas = areasRes?.data || [];

  // Names for summary
  const selectedCountry = countries.find(c => c.id.toString() === selectedCountryId)?.name;
  const selectedGov = governorates.find(g => g.id.toString() === selectedGovernorateId)?.name;
  const selectedCity = cities.find(c => c.id.toString() === selectedCityId)?.name;
  const selectedArea = areas.find(a => a.id.toString() === selectedAreaId)?.name;

  const handleReset = () => {
    setSelectedCountryId("");
    setSelectedGovernorateId("");
    setSelectedCityId("");
    setSelectedAreaId("");
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations Explorer</h1>
          <p className="text-muted-foreground">
            Select a location through the hierarchical dropdowns.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <LocationSelector
        countries={countries}
        governorates={governorates}
        cities={cities}
        areas={areas}
        loadingCountries={loadingCountries}
        loadingGovs={loadingGovs}
        loadingCities={loadingCities}
        loadingAreas={loadingAreas}
        selectedCountryId={selectedCountryId}
        selectedGovernorateId={selectedGovernorateId}
        selectedCityId={selectedCityId}
        selectedAreaId={selectedAreaId}
        setSelectedCountryId={setSelectedCountryId}
        setSelectedGovernorateId={setSelectedGovernorateId}
        setSelectedCityId={setSelectedCityId}
        setSelectedAreaId={setSelectedAreaId}
        selectedCountry={selectedCountry}
        selectedGov={selectedGov}
        selectedCity={selectedCity}
        selectedArea={selectedArea}
      />
    </div>
  );
}
