import axiosInstance from '@/api/config';
import type { GovernoratesResponse } from '@/types/location';
import { useQuery } from '@tanstack/react-query';

const getGovernorates = async (countryId: number): Promise<GovernoratesResponse> => {
    try {
        const response = await axiosInstance.get(`locations/countries/${countryId}/governorates`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching governorates:", error.response?.data || error.message);
        throw error;
    }
};

export default function useGetGovernorates(countryId: number | null) {
    return useQuery({
        queryKey: ["governorates", countryId],
        queryFn: () => getGovernorates(countryId!),
        enabled: !!countryId,
    });
}
