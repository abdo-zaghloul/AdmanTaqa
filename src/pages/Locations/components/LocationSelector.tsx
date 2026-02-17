import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Globe, Landmark, Building, Navigation } from "lucide-react";

interface LocationSelectorProps {
    // Data
    countries: any[];
    governorates: any[];
    cities: any[];
    areas: any[];
    // Loading states
    loadingCountries: boolean;
    loadingGovs: boolean;
    loadingCities: boolean;
    loadingAreas: boolean;
    // Selection IDs
    selectedCountryId: string;
    selectedGovernorateId: string;
    selectedCityId: string;
    selectedAreaId: string;
    // Setters
    setSelectedCountryId: (id: string) => void;
    setSelectedGovernorateId: (id: string) => void;
    setSelectedCityId: (id: string) => void;
    setSelectedAreaId: (id: string) => void;
    // Selected names for summary
    selectedCountry?: string;
    selectedGov?: string;
    selectedCity?: string;
    selectedArea?: string;
}

export default function LocationSelector({
    countries,
    governorates,
    cities,
    areas,
    loadingCountries,
    loadingGovs,
    loadingCities,
    loadingAreas,
    selectedCountryId,
    selectedGovernorateId,
    selectedCityId,
    selectedAreaId,
    setSelectedCountryId,
    setSelectedGovernorateId,
    setSelectedCityId,
    setSelectedAreaId,
    selectedCountry,
    selectedGov,
    selectedCity,
    selectedArea,
}: LocationSelectorProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Selection Card */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Selection
                    </CardTitle>
                    <CardDescription>Drill down to find a specific area.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Country Select */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            Country
                        </Label>
                        <Select
                            value={selectedCountryId}
                            onValueChange={(val) => {
                                setSelectedCountryId(val);
                                setSelectedGovernorateId("");
                                setSelectedCityId("");
                                setSelectedAreaId("");
                            }}
                            disabled={loadingCountries}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={loadingCountries ? "Loading countries..." : "Select Country"} />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country.id} value={country.id.toString()}>
                                        {country.name} ({country.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Governorate Select */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                            Governorate
                        </Label>
                        <Select
                            value={selectedGovernorateId}
                            onValueChange={(val) => {
                                setSelectedGovernorateId(val);
                                setSelectedCityId("");
                                setSelectedAreaId("");
                            }}
                            disabled={!selectedCountryId || loadingGovs}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedCountryId ? "Select a country first" : loadingGovs ? "Loading..." : "Select Governorate"} />
                            </SelectTrigger>
                            <SelectContent>
                                {governorates.map((gov) => (
                                    <SelectItem key={gov.id} value={gov.id.toString()}>
                                        {gov.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City Select */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            City
                        </Label>
                        <Select
                            value={selectedCityId}
                            onValueChange={(val) => {
                                setSelectedCityId(val);
                                setSelectedAreaId("");
                            }}
                            disabled={!selectedGovernorateId || loadingCities}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedGovernorateId ? "Select a governorate first" : loadingCities ? "Loading..." : "Select City"} />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((city) => (
                                    <SelectItem key={city.id} value={city.id.toString()}>
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Area Select */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Navigation className="h-4 w-4 text-muted-foreground" />
                            Area
                        </Label>
                        <Select
                            value={selectedAreaId}
                            onValueChange={setSelectedAreaId}
                            disabled={!selectedCityId || loadingAreas}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedCityId ? "Select a city first" : loadingAreas ? "Loading..." : "Select Area"} />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id.toString()}>
                                        {area.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Card */}
            <div className="space-y-4">
                <Card className="bg-muted/30 border-dashed w-3/4">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Location Details</CardTitle>
                        <CardDescription>Summary of your selection.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase">Path</span>
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    {selectedCountry ? <span className="font-semibold text-primary">{selectedCountry}</span> : <Skeleton className="h-4 w-20" />}
                                    {selectedGov && <><span className="text-muted-foreground">/</span> <span className="font-semibold">{selectedGov}</span></>}
                                    {selectedCity && <><span className="text-muted-foreground">/</span> <span className="font-semibold">{selectedCity}</span></>}
                                    {selectedArea && <><span className="text-muted-foreground">/</span> <span className="font-semibold text-green-600">{selectedArea}</span></>}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    {selectedArea && (
                        <CardFooter>
                            <div className="w-full p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 text-green-700 dark:text-green-400 text-xs flex items-center gap-2">
                                <Navigation className="h-3.5 w-3.5 shrink-0" />
                                Full location hierarchy successfully identified.
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
