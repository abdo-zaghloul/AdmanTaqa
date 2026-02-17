import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function RegisterFuelRetail() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "SA", // Saudi Arabia as default
    description: "",
    licenseNumber: "",
    establishmentDate: "",
    contactPerson: "",
    contactPosition: "",
    capacity: "",
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    operatingHours: "24/7",
    emergencyContact: "",
    services: []
  });

  // State for file uploads
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [businessFile, setBusinessFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (type: 'license' | 'business' | 'insurance', file: File | null) => {
    if (type === 'license') {
      setLicenseFile(file);
    } else if (type === 'business') {
      setBusinessFile(file);
    } else {
      setInsuranceFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.licenseNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, this would send data to an API
    console.log("Form submitted:", { ...formData, licenseFile, businessFile, insuranceFile });
    
    toast.success("Fuel retail station registered successfully! Awaiting approval.");
    navigate('/fuel-retail');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/fuel-retail')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Register Fuel Retail Station</h1>
            <Badge variant="outline" className="text-xs font-medium">
              PENDING APPROVAL
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Submit your fuel retail station details for review and approval
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Station Information</CardTitle>
          <CardDescription>
            Provide accurate details about your fuel retail station
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

            {/* Document Uploads */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Required Documents</Label>
              <p className="text-sm text-muted-foreground">Upload the following documents for verification</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-upload">Business License *</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="license-upload"
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('license', e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-upload">Business Registration *</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="business-upload"
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('business', e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance-upload">Insurance Certificate *</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="insurance-upload"
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange('insurance', e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/fuel-retail')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit for Approval
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registration Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="list-disc pl-5 space-y-2">
            <li>All fields marked with * are mandatory</li>
            <li>Documents must be clear and legible</li>
            <li>Station details must match official documents</li>
            <li>Registration requests are typically reviewed within 2-3 business days</li>
            <li>You will receive an email notification once approved</li>
            <li>Fuel retail stations must comply with all safety and environmental regulations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}