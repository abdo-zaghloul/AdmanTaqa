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
import { ChevronLeft, Building2, Mail, Phone, MapPin, Globe, Users, FileText } from "lucide-react";

export default function CreateRegisterOrganization() {
    const navigate = useNavigate();

    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        type: "FUEL_STATION", // default
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
        contactPosition: ""
    });

    // State for file uploads
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [businessFile, setBusinessFile] = useState<File | null>(null);

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

    const handleFileChange = (type: 'license' | 'business', file: File | null) => {
        if (type === 'license') {
            setLicenseFile(file);
        } else {
            setBusinessFile(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            toast.error("Please fill in all required fields");
            return;
        }

        // In a real app, this would send data to an API
        console.log("Form submitted:", { ...formData, licenseFile, businessFile });
        
        toast.success("Organization registered successfully! Awaiting approval.");
        navigate('/organizations');
    };

    return (
        <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/organizations')}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Register Organization</h1>
                        <Badge variant="outline" className="text-xs font-medium">
                            PENDING APPROVAL
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Submit your organization details for review and approval
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Information</CardTitle>
                    <CardDescription>
                        Provide accurate details about your organization
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Organization Name *</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="name" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter organization name" 
                                        className="pl-10" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Organization Type *</Label>
                                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FUEL_STATION">Fuel Station</SelectItem>
                                        <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                        placeholder="organization@example.com" 
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
                                        placeholder="https://www.organization.com" 
                                        className="pl-10" 
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

                        {/* Contact Person Information */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Contact Person</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Full Name *</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="contactPerson" 
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            placeholder="Full name of primary contact" 
                                            className="pl-10" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPosition">Position *</Label>
                                    <Input 
                                        id="contactPosition" 
                                        name="contactPosition"
                                        value={formData.contactPosition}
                                        onChange={handleInputChange}
                                        placeholder="Job title or position" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Organization Description *</Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your organization, services offered, and business objectives..."
                                    className="min-h-[120px] pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Required Documents</Label>
                            <p className="text-sm text-muted-foreground">Upload the following documents for verification</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>
                        </div>

                        {/* Submission Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate('/organizations')}
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
                        <li>Organization details must match official documents</li>
                        <li>Registration requests are typically reviewed within 2-3 business days</li>
                        <li>You will receive an email notification once approved</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}