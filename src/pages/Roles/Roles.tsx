import RoleCardsGrid from "./Component/RoleCardsGrid";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// Mock Data
const MOCK_ROLES = [
  {
    id: "ROLE-001",
    name: "Authority Administrator",
    description: "Full system access with approval and management rights over all organizations.",
    permissions: ["organizations:read", "organizations:approve", "users:all", "inspections:create", "audit:read"],
    userCount: 4,
    type: "GLOBAL",
  },
  {
    id: "ROLE-002",
    name: "Service Provider Manager",
    description: "Manage service provider profile, users, branches, and submit quotations.",
    permissions: ["branches:read", "branches:create", "quotations:submit", "quotations:read", "users:read"],
    userCount: 12,
    type: "ORGANIZATION",
  },
  {
    id: "ROLE-003",
    name: "Fuel Station Manager",
    description: "Request services for branches and manage station details.",
    permissions: ["branches:all", "requests:create", "requests:read", "job-orders:read"],
    userCount: 28,
    type: "ORGANIZATION",
  },
  {
    id: "ROLE-004",
    name: "Inspector",
    description: "Access to conduct inspections and view organization compliance documents.",
    permissions: ["inspections:read", "inspections:report", "organizations:read", "documents:view"],
    userCount: 8,
    type: "GLOBAL",
  },
];

export default function Roles() {
  const handleDeleteConfirm = (role: { id: string; name: string }) => {
    console.log(`Deleting role: ${role.name}`);
  };
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Define access levels and assign permissions to different user categories.
          </p>
        </div>
        <Button className="gap-2 shadow-lg" onClick={() => navigate("/roles/create")}>
          <Plus className="h-4 w-4" />
          Create Custom Role
        </Button>
      </div>      <RoleCardsGrid roles={MOCK_ROLES} onDeleteConfirm={handleDeleteConfirm} />
    </div>
  );
}
