import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  FileText,
  Building2
} from "lucide-react";

// Mock Data (In a real app, this would be fetched from an API)
const MOCK_FUEL_RETAIL = [
  {
    id: "FUEL-001",
    name: "Al-Amal Fuel Station",
    location: "Riyadh, Saudi Arabia",
    status: "APPROVED",
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
    status: "PENDING",
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
    status: "REJECTED",
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

export default function EditFuelRetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form data - initialize with default values
  const [stationData, setStationData] = useState(() => {
    // Find fuel station by ID or default to empty object
    const foundStation = MOCK_FUEL_RETAIL.find((s) => s.id === id);
    if (foundStation) {
      return {
        found: true,
        station: {
          name: foundStation.name,
          email: foundStation.email,
          phone: foundStation.phone,
          website: foundStation.email.includes('@') ? `https://www.${foundStation.email.split('@')[1]}` : '',
          address: foundStation.address,
          city: foundStation.city,
          country: foundStation.country,
          description: `Details for ${foundStation.name}`,
          licenseNumber: foundStation.license,
          establishmentDate: foundStation.createdAt,
          contactPerson: foundStation.manager,
          contactPosition: "Station Manager",
          capacity: foundStation.capacity,
          managerName: foundStation.manager,
          managerEmail: foundStation.email,
          managerPhone: foundStation.phone,
          operatingHours: foundStation.openingHours,
          emergencyContact: foundStation.emergencyContact,
        }
      };
    } else {
      return {
        found: false,
        station: {
          name: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          city: '',
          country: 'SA',
          description: '',
          licenseNumber: '',
          establishmentDate: '',
          contactPerson: '',
          contactPosition: '',
          capacity: '',
          managerName: '',
          managerEmail: '',
          managerPhone: '',
          operatingHours: '24/7',
          emergencyContact: '',
        }
      };
    }
  });

  if (!stationData.found) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
        <p>Fuel station not found</p>
        <Button variant="link" onClick={() => navigate('/fuel-retail')}>Return to Fuel Retail</Button>
      </div>
    );
  }

  const initialStation = MOCK_FUEL_RETAIL.find((s) => s.id === id);
  const formData = stationData.station;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStationData(prevState => ({
      ...prevState,
      station: {
        ...prevState.station,
        [name]: value
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setStationData(prevState => ({
      ...prevState,
      station: {
        ...prevState.station,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.licenseNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would send data to an API
    console.log("Form submitted:", formData);
    
    toast.success(`Fuel retail station "${formData.name}" updated successfully!`);
    navigate(`/fuel-retail/${id}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/fuel-retail/${id}`)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Edit Fuel Retail Station</h1>
            <Badge variant="outline" className="text-xs font-medium">
              {initialStation?.status || 'N/A'}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Update details for {initialStation?.name || 'Fuel Station'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Station Information</CardTitle>
          <CardDescription>
            Update the details about your fuel retail station
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Station Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter station name" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input 
                  id="licenseNumber" 
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter official license number" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="station@example.com" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966 50 123 4567" 
                    className="pl-10" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.station.com" 
                    className="pl-10" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Fuel Capacity (Liters)</Label>
                <Input 
                  id="capacity" 
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000" 
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Address Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="address" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SA">Saudi Arabia</SelectItem>
                      <SelectItem value="AE">United Arab Emirates</SelectItem>
                      <SelectItem value="KW">Kuwait</SelectItem>
                      <SelectItem value="QA">Qatar</SelectItem>
                      <SelectItem value="BH">Bahrain</SelectItem>
                      <SelectItem value="OM">Oman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Manager Information */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Station Manager</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Full Name *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="managerName" 
                      name="managerName"
                      value={formData.managerName}
                      onChange={handleInputChange}
                      placeholder="Full name of station manager" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerEmail">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="managerEmail" 
                      name="managerEmail"
                      type="email"
                      value={formData.managerEmail}
                      onChange={handleInputChange}
                      placeholder="manager@station.com" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerPhone">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="managerPhone" 
                      name="managerPhone"
                      value={formData.managerPhone}
                      onChange={handleInputChange}
                      placeholder="+966 50 123 4567" 
                      className="pl-10" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Information */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Operational Details</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Select value={formData.operatingHours} onValueChange={(value) => handleSelectChange('operatingHours', value)}>
                    <SelectTrigger id="operatingHours">
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24/7">24/7</SelectItem>
                      <SelectItem value="6AM-10PM">6 AM - 10 PM</SelectItem>
                      <SelectItem value="24/7 with breaks">24/7 with breaks</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="emergencyContact" 
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="+966 50 123 4567" 
                      className="pl-10" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Station Description *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your fuel retail station, services offered, and operational details..."
                  className="min-h-[120px] pl-10"
                  required
                />
              </div>
            </div>

            {/* Submission Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/fuel-retail/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}