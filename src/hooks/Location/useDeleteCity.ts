import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteCity = async (id: number): Promise<void> => {
  await axiosInstance.delete(`locations/cities/${id}`);
};

export default function useDeleteCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
}
