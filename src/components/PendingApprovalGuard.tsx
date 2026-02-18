import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PendingApprovalGuardProps {
  children: React.ReactNode;
  organization: { type?: string; status?: string } | null | undefined;
  isLoading?: boolean;
}

/**
 * For SERVICE_PROVIDER: when organization is not APPROVED, shows a message and blocks operational content.
 * Otherwise renders children.
 */
export default function PendingApprovalGuard({
  children,
  organization,
  isLoading,
}: PendingApprovalGuardProps) {
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isServiceProvider = organization?.type === "SERVICE_PROVIDER";
  const isApproved = organization?.status === "APPROVED";

  if (isServiceProvider && !isApproved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-8 max-w-md text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-500 mx-auto" />
          <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-200">
            Organization pending approval
          </h2>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            This section is available only after your organization is approved. Please complete your profile and wait for approval.
          </p>
          <Button asChild variant="outline" className="border-amber-300 text-amber-800">
            <Link to="/profile">Go to Profile</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
