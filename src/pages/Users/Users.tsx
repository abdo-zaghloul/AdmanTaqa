import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Filter } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import UsersTableCardContent from "./component/UsersTableCardContent";

// Mock Data
const MOCK_USERS = [
    {
        id: "USR-001",
        fullName: "Ahmed Mansour",
        email: "ahmed.m@alamal.com",
        phone: "+966 50 123 4567",
        role: "ADMIN",
        orgName: "Al-Amal Fuel Station",
        status: "ACTIVE",
    },
    {
        id: "USR-002",
        fullName: "Sarah Al-Ghamdi",
        email: "sarah.g@ecoenergy.sa",
        phone: "+966 55 987 6543",
        role: "SERVICE_PROVIDER",
        orgName: "EcoEnergy Services",
        status: "ACTIVE",
    },
    {
        id: "USR-003",
        fullName: "Mohammed Khalid",
        email: "m.khalid@authority.gov",
        phone: "+966 51 000 1111",
        role: "AUTHORITY",
        orgName: "Energy Authority",
        status: "ACTIVE",
    },
    {
        id: "USR-004",
        fullName: "Laila Ibrahim",
        email: "laila.i@redseapetro.com",
        phone: "+966 53 444 5555",
        role: "BRANCH_MANAGER",
        orgName: "Red Sea Petroleum",
        status: "ACTIVE",
    },
    {
        id: "USR-005",
        fullName: "Yasser Fawzi",
        email: "yasser.f@mmasters.net",
        phone: "+966 54 222 3333",
        role: "TECHNICIAN",
        orgName: "Maintenance Masters",
        status: "INACTIVE",
    },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("User created successfully!");
    setIsCreateModalOpen(false);
  };

  const handleDeleteUser = (user: (typeof MOCK_USERS)[0]) => {
    toast.success(`User ${user.fullName} deleted successfully`);
  };

  return (
        <div className="p-4 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
           
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage user accounts, roles, and access permissions.
                    </p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-sm">
                            <UserPlus className="h-4 w-4" />
                            Create New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>
                                Add a new user to the system. They will receive an email to set their password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" placeholder="+966..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="org">Organization</Label>
                                    <Select defaultValue="AL_AMAL">
                                        <SelectTrigger id="org">
                                            <SelectValue placeholder="Select organization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AL_AMAL">Al-Amal Fuel Station</SelectItem>
                                            <SelectItem value="ECO_ENERGY">EcoEnergy Services</SelectItem>
                                            <SelectItem value="AUTHORITY">Energy Authority</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">System Role</Label>
                                <Select defaultValue="TECHNICIAN">
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Administrator</SelectItem>
                                        <SelectItem value="AUTHORITY">Authority Viewer</SelectItem>
                                        <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                                        <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>
                                        <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create User</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-xl bg-card/70 backdrop-blur-md">

                <CardHeader className="pb-3 px-6 pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or ID..."
                                className="pl-10 bg-background/50 border-muted-foreground/10 focus-visible:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                                <Filter className="h-4 w-4" />
                                Role:
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[180px] bg-background/50 border-muted-foreground/10">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="AUTHORITY">Authority</SelectItem>
                                    <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                                    <SelectItem value="BRANCH_MANAGER">Branch Manager</SelectItem>
                                    <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <UsersTableCardContent users={filteredUsers} onDeleteConfirm={handleDeleteUser} />
            </Card>
        </div>
    );
}
