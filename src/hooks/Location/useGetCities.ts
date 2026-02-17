 import axiosInstance from '@/api/config';
import type { CitiesResponse } from '@/types/location';
import { useQuery } from '@tanstack/react-query';

const getCities = async (governorateId: number): Promise<CitiesResponse> => {
    try {
        const response = await axiosInstance.get(`locations/governorates/${governorateId}/cities`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching cities:", error.response?.data || error.message);
        throw error;
    }
};

export default function useGetCities(governorateId: number | null) {
    return useQuery({
        queryKey: ["cities", governorateId],
        queryFn: () => getCities(governorateId!),
        enabled: !!governorateId,
    });
}
