import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MapPin,
  Mail,
  Phone,
  Settings2,
  ChevronLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock Data (In a real app, this would be fetched from an API)
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
    licenseExpiry: "2025-01-15",
    capacity: "50,000 liters",
    services: ["Fuel Dispensing", "Car Wash", "Convenience Store", "Oil Change"],
    employees: 12,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10",
    address: "King Abdulaziz Road, Riyadh",
    city: "Riyadh",
    country: "Saudi Arabia",
    postalCode: "12345",
    openingHours: "24/7",
    emergencyContact: "+966 11 123 4568",
    lastInspection: "2024-01-20",
    nextInspection: "2024-04-20"
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
    licenseExpiry: "2025-02-01",
    capacity: "40,000 liters",
    services: ["Fuel Dispensing", "Car Wash", "Convenience Store"],
    employees: 8,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
    address: "Corniche Road, Jeddah",
    city: "Jeddah",
    country: "Saudi Arabia",
    postalCode: "23456",
    openingHours: "24/7",
    emergencyContact: "+966 12 987 6544",
    lastInspection: "2024-01-25",
    nextInspection: "2024-04-25"
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
    licenseExpiry: "2024-12-20",
    capacity: "60,000 liters",
    services: ["Premium Fuel", "Car Wash", "Lubricants"],
    employees: 15,
    createdAt: "2023-12-20",
    updatedAt: "2024-01-30",
    address: "King Fahd Highway, Dammam",
    city: "Dammam",
    country: "Saudi Arabia",
    postalCode: "34567",
    openingHours: "24/7",
    emergencyContact: "+966 13 456 7891",
    lastInspection: "2024-01-15",
    nextInspection: "2024-04-15"
  },
];

export default function FuelRetailDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find fuel station by ID or default to null/undefined
  const station = MOCK_FUEL_RETAIL.find((s) => s.id === id);

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p>Fuel station not found</p>
        <Button variant="link" onClick={() => navigate('/fuel-retail')}>Return to Fuel Retail</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/fuel-retail')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{station.name}</h1>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{station.location}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/fuel-retail/${station.id}/edit`)}>
            <Settings2 className="h-4 w-4 mr-2" />
            Edit Station
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Station Information</CardTitle>
            <CardDescription>Basic details about the fuel station.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">License Number</h4>
                <p className="font-medium">{station.license}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">License Expiry</h4>
                <p className="font-medium">{station.licenseExpiry}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Capacity</h4>
                <p className="font-medium">{station.capacity}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Opening Hours</h4>
                <p className="font-medium">{station.openingHours}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {station.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats / Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <div>
                  <div className="font-medium">{station.manager}</div>
                  <div className="text-xs text-muted-foreground">Station Manager</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{station.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{station.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{station.emergencyContact}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{station.address}</div>
                  <div className="text-xs text-muted-foreground">{station.city}, {station.country}</div>
                  <div className="text-xs text-muted-foreground">Postal Code: {station.postalCode}</div>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>

      {/* Additional Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inspection History</CardTitle>
            <CardDescription>Recent inspection dates and next scheduled inspection.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Inspection</span>
                <span className="font-medium">{station.lastInspection}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Inspection</span>
                <span className="font-medium">{station.nextInspection}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational Stats</CardTitle>
            <CardDescription>Key metrics for the fuel station.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xl font-bold">{station.employees}</div>
                <div className="text-xs text-muted-foreground">Employees</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xl font-bold">{station.services.length}</div>
                <div className="text-xs text-muted-foreground">Services</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xl font-bold">{station.capacity.split(',')[0]}</div>
                <div className="text-xs text-muted-foreground">Capacity (L)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}