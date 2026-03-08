import { useQuery } from "@tanstack/react-query";
import { fetchOperators } from "@/api/services/providerService";

export default function useGetOperators() {
  return useQuery({
    queryKey: ["operators"],
    queryFn: () => fetchOperators(),
  });
}
