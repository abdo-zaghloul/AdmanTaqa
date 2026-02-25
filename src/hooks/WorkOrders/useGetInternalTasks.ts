import { useQuery } from "@tanstack/react-query";
import { fetchInternalTasks } from "@/api/services/internalTaskService";
import type { InternalTasksQuery } from "@/types/internalTask";

export default function useGetInternalTasks(query: InternalTasksQuery) {
  return useQuery({
    queryKey: ["internal-tasks", query],
    queryFn: () => fetchInternalTasks(query),
  });
}
