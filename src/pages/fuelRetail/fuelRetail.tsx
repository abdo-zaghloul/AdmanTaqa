import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Droplets } from "lucide-react";
import TableFuelRetail from "./Component/TableFuelRetail";

// Mock Data
const MOCK_FUEL_RETAIL = [
  {
    id: "FUEL-001",
    name: "Al-Amal Fuel Station",
    location: "Riyadh, Saudi Arabia",
    // status: "APPROVED",
    manager: "Ahmed Ali",
    email: "contact@alamal.com",
    phone: "+966 11 123 4567",
    license: "FUEL-2024-001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "FUEL-002",
    name: "Desert Oasis Station",
    location: "Jeddah, Saudi Arabia",
    // status: "PENDING",
    manager: "Fatima Hassan",
    email: "manager@desertoasis.com",
    phone: "+966 12 987 6543",
    license: "FUEL-2024-002",
    createdAt: "2024-02-01T14:30:00Z",
  },
  {
    id: "FUEL-003",
    name: "Red Sea Petroleum",
    location: "Dammam, Saudi Arabia",
    // status: "REJECTED",
    manager: "Mohammed Khalid",
    email: "ops@redseapetro.com",
    phone: "+966 13 456 7890",
    license: "FUEL-2023-003",
    createdAt: "2023-12-20T08:15:00Z",
  },
  {
    id: "FUEL-004",
    name: "Green Valley Fuel",
    location: "Medina, Saudi Arabia",
    manager: "Sara Ahmed",
    email: "admin@greenvalley.com",
    phone: "+966 14 234 5678",
    license: "FUEL-2024-003",
    createdAt: "2024-01-10T11:45:00Z",
  },
  {
    id: "FUEL-005",
    name: "Sunrise Fuel Station",
    location: "Tabuk, Saudi Arabia",
    manager: "Omar Said",
    email: "info@sunrisefuel.com",
    phone: "+966 15 876 5432",
    license: "FUEL-2024-004",
    createdAt: "2024-02-05T09:20:00Z",
  },
];

export default function FuelRetail() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredFuelStations = MOCK_FUEL_RETAIL.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Droplets className="h-8 w-8 text-blue-500" />
            Fuel Retail Stations
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all fuel retail stations in the system.
          </p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => navigate('/fuel-retail/register')}>
          <Plus className="h-4 w-4" />
          Register Fuel Station
        </Button>
      </div>

      <TableFuelRetail
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stations={filteredFuelStations}
      />
    </div>
  );
}