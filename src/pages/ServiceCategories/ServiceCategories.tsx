import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import ProfileServiceCategoriesCard from "@/pages/Profile/components/ProfileServiceCategoriesCard";

export default function ServiceCategories() {
  const { data: organizationResponse, isLoading } = useGetOrganization();
  const organization = organizationResponse?.data;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!organization?.id) {
    return (
      <div className="px-8 py-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load organization.
        </div>
      </div>
    );
  }

  if (organization.type !== "SERVICE_PROVIDER" && organization.type !== "AUTHORITY") {
    return (
      <div className="px-8 py-8">
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Service categories page is available for Service Provider and Authority only.
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Service Categories</h1>
        <p className="text-muted-foreground">
          Browse categories and manage them according to your organization type.
        </p>
      </div>

      <ProfileServiceCategoriesCard
        organizationId={organization.id}
        organizationType={organization.type}
      />
    </div>
  );
}
