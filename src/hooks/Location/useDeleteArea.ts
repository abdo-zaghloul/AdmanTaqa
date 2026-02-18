import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteArea = async (id: number): Promise<void> => {
  await axiosInstance.delete(`locations/areas/${id}`);
};

export default function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
}
