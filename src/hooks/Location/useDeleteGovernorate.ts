import axiosInstance from "@/api/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteGovernorate = async (id: number): Promise<void> => {
  await axiosInstance.delete(`locations/governorates/${id}`);
};

export default function useDeleteGovernorate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGovernorate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
    },
  });
}
