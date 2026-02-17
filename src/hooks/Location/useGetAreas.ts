import axiosInstance from '@/api/config';
import type { AreasResponse } from '@/types/location';
import { useQuery } from '@tanstack/react-query';

const getAreas = async (cityId: number): Promise<AreasResponse> => {
    try {
        const response = await axiosInstance.get(`locations/cities/${cityId}/areas`);
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error("Error fetching areas:", err.response?.data ?? err.message ?? error);
        throw error;
    }
};

export default function useGetAreas(cityId: number | null) {
    return useQuery({
        queryKey: ["areas", cityId],
        queryFn: () => getAreas(cityId!),
        enabled: !!cityId,
    });
}
