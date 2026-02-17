export interface Country {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface Governorate {
    id: number;
    countryId: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface City {
    id: number;
    governorateId: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface Area {
    id: number;
    cityId: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

/** Area with optional coordinates from GET locations/areas/:id */
export interface AreaDetails extends Area {
    latitude?: number | null;
    longitude?: number | null;
}

export interface CountriesResponse {
    success: boolean;
    data: Country[];
}

export interface CountryResponse {
    success: boolean;
    data: Country;
}

export interface GovernoratesResponse {
    success: boolean;
    data: Governorate[];
}

export interface CitiesResponse {
    success: boolean;
    data: City[];
}

export interface AreasResponse {
    success: boolean;
    data: Area[];
}
