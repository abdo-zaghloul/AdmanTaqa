import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TableOrganization from "./Component/TableOrganization";

// Mock Data
const MOCK_ORGANIZATIONS = [
  {
    id: "ORG-001",
    name: "Al-Amal Fuel Station",
    type: "FUEL_STATION",
    status: "APPROVED",
    email: "contact@alamal.com",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "ORG-002",
    name: "EcoEnergy Services",
    type: "SERVICE_PROVIDER",
    status: "PENDING",
    email: "info@ecoenergy.sa",
    createdAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "ORG-003",
    name: "Desert Oasis Station",
    type: "FUEL_STATION",
    status: "REJECTED",
    email: "manager@desertoasis.com",
    createdAt: "2023-12-20T08:15:00Z",
  },
  {
    id: "ORG-004",
    name: "Maintenance Masters",
    type: "SERVICE_PROVIDER",
    status: "APPROVED",
    email: "support@mmasters.net",
    createdAt: "2024-01-10T11:45:00Z",
  },
  {
    id: "ORG-005",
    name: "Red Sea Petroleum",
    type: "FUEL_STATION",
    status: "APPROVED",
    email: "ops@redseapetro.com",
    createdAt: "2024-02-05T09:20:00Z",
  },
];

export default function Organizations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOrgs = MOCK_ORGANIZATIONS.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">service providers</h1>
          <p className="text-muted-foreground">
            Manage and monitor all service providers and fuel stations.
          </p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => navigate('/organizations/register')}>
          <Plus className="h-4 w-4" />
          Register Organization
        </Button>
      </div>

      <TableOrganization
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        organizations={filteredOrgs}
      />
    </div>
  );
}
