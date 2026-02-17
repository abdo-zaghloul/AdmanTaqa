import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Mock data – same as Users.tsx (in real app would come from API)
const MOCK_USERS = [
    { id: "USR-001", fullName: "Ahmed Mansour", email: "ahmed.m@alamal.com", phone: "+966 50 123 4567", role: "ADMIN", orgName: "Al-Amal Fuel Station", status: "ACTIVE" },
    { id: "USR-002", fullName: "Sarah Al-Ghamdi", email: "sarah.g@ecoenergy.sa", phone: "+966 55 987 6543", role: "SERVICE_PROVIDER", orgName: "EcoEnergy Services", status: "ACTIVE" },
    { id: "USR-003", fullName: "Mohammed Khalid", email: "m.khalid@authority.gov", phone: "+966 51 000 1111", role: "AUTHORITY", orgName: "Energy Authority", status: "ACTIVE" },
    { id: "USR-004", fullName: "Laila Ibrahim", email: "laila.i@redseapetro.com", phone: "+966 53 444 5555", role: "BRANCH_MANAGER", orgName: "Red Sea Petroleum", status: "ACTIVE" },
    { id: "USR-005", fullName: "Yasser Fawzi", email: "yasser.f@mmasters.net", phone: "+966 54 222 3333", role: "TECHNICIAN", orgName: "Maintenance Masters", status: "INACTIVE" },
];

type UserData = { id: string; fullName: string; email: string; phone: string; role: string; orgName: string; status: string };

function UpdateUserForm({ id, initialUser, onCancel }: { id: string; initialUser: UserData; onCancel: () => void }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: initialUser.fullName,
        email: initialUser.email,
        phone: initialUser.phone,
        role: initialUser.role,
        orgName: initialUser.orgName,
        status: initialUser.status,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updating user:", formData);
        toast.success("User updated successfully!");
        setTimeout(() => navigate("/users"), 1000);
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <Card className="border-none shadow-xl bg-card/70 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Update User</CardTitle>
                    <p className="text-muted-foreground text-sm font-mono">{id}</p>
                    <p className="text-muted-foreground">Modify user details and permissions.</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">System Role</Label>
                                <Select value={formData.role} onValueChange={(v) => handleSelectChange("role", v)}>
                                    <SelectTrigger id="role"><SelectValue placeholder="Select role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Administrator</SelectItem>
                                        <SelectItem value="AUTHORITY">Authority Viewer</SelectItem>
                                        <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                                        <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>
                                        <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="orgName">Organization</Label>
                                <Input id="orgName" name="orgName" value={formData.orgName} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                                    <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button type="submit">Update User</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function UpdateUser() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    const initialUserData = location.state?.userData ?? (id ? MOCK_USERS.find(u => u.id === id) : null);

    if (!initialUserData) {
        return (
            <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
                <Card className="border-none shadow-xl bg-card/70 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-xl text-muted-foreground">User not found</CardTitle>
                        <p className="text-muted-foreground">The user with ID &quot;{id}&quot; could not be found.</p>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" onClick={() => navigate("/users")}>Back to Users</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <UpdateUserForm key={id} id={id!} initialUser={initialUserData} onCancel={() => navigate(-1)} />;
}