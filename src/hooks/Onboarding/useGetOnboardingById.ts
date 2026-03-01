import { useQuery } from "@tanstack/react-query";
import { fetchOnboardingById } from "@/api/services/onboardingService";

export default function useGetOnboardingById(id: string | number | undefined) {
  return useQuery({
    queryKey: ["onboarding", "detail", id],
    queryFn: () => fetchOnboardingById(id!),
    enabled: id !== undefined && id !== "",
  });
}
