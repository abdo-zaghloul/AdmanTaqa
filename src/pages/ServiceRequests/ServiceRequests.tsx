import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ServiceRequestsTableHeader from "./Component/ServiceRequestsTableHeader";
import TableServiceRequests from "./Component/TableServiceRequests";
import useGetOrganization from "@/hooks/Organization/useGetOrganization";
import PendingApprovalGuard from "@/components/PendingApprovalGuard";

// Mock Data
const MOCK_REQUESTS = [
  {
    id: "REQ-2024-001",
    subject: "Fuel Pump Maintenance",
    station: "Al-Amal Station",
    branch: "North Riyadh",
    status: "OPEN",
    priority: "HIGH",
    createdAt: "2024-02-08T09:00:00Z",
  },
  {
    id: "REQ-2024-002",
    subject: "Electrical System Inspection",
    station: "Red Sea Petroleum",
    branch: "Jeddah Port",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: "2024-02-05T14:20:00Z",
  },
  {
    id: "REQ-2024-003",
    subject: "Tank Leakage Check",
    station: "Desert Oasis",
    branch: "Mecca East",
    status: "CLOSED",
    priority: "URGENT",
    createdAt: "2024-01-25T11:00:00Z",
  },
  {
    id: "REQ-2024-004",
    subject: "Software System Update",
    station: "Al-Amal Station",
    branch: "Dammam South",
    status: "OPEN",
    priority: "LOW",
    createdAt: "2024-02-09T08:30:00Z",
  },
];

export default function ServiceRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: orgResponse, isLoading: orgLoading } = useGetOrganization();
  const organization = orgResponse?.data;

  const filteredRequests = MOCK_REQUESTS.filter(
    (req) =>
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PendingApprovalGuard organization={organization} isLoading={orgLoading}>
      <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-left duration-500">
        <ServiceRequestsTableHeader />
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests, stations, branches..."
                className="pl-10 bg-background/50 border-muted-foreground/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <TableServiceRequests requests={filteredRequests} />
        </Card>
      </div>
    </PendingApprovalGuard>
  );
}
