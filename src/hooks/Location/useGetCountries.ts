import axiosInstance from '@/api/config';
import type { CountriesResponse } from '@/types/location';
import { useQuery } from '@tanstack/react-query';

const getCountries = async (): Promise<CountriesResponse> => {
    try {
        const response = await axiosInstance.get("locations/countries");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching countries:", error.response?.data || error.message);
        throw error;
    }
};

export default function useGetCountries() {
    return useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
    });
}
