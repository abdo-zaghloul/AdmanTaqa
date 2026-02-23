import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

type PermissionGuardProps = {
  required: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function PermissionGuard({
  required,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission } = useAuth();
  if (!hasPermission(required)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
