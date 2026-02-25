import { useQuery } from "@tanstack/react-query";
import { fetchMyInternalTasks } from "@/api/services/internalTaskService";

export default function useGetMyInternalTasks(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["internal-tasks", "my", page, limit],
    queryFn: () => fetchMyInternalTasks(page, limit),
  });
}
