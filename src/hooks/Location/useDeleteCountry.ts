import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteCountry = async (id: number): Promise<void> => {
  await axiosInstance.delete(`locations/countries/${id}`);
};

export default function useDeleteCountry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCountry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
  });
}
