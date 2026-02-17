import { useState } from "react";
import { Activity } from "lucide-react";
import TableAuditLog from "./Component/TableAuditLog";

// Mock Data
const MOCK_AUDIT_LOGS = [
  {
    id: "LOG-9901",
    user: "Mohammed Khalid",
    action: "APPROVE_ORGANIZATION",
    resource: "ORGANIZATION",
    resourceId: "ORG-002",
    timestamp: "2024-02-10T15:30:00Z",
    details: "Approved EcoEnergy Services after document review.",
  },
  {
    id: "LOG-9902",
    user: "Ahmed Mansour",
    action: "CREATE_USER",
    resource: "USER",
    resourceId: "USR-105",
    timestamp: "2024-02-10T14:45:00Z",
    details: "Created new technician account for Yasser Fawzi.",
  },
  {
    id: "LOG-9903",
    user: "Sarah Al-Ghamdi",
    action: "UPDATE_BRANCH",
    resource: "BRANCH",
    resourceId: "BR-102",
    timestamp: "2024-02-10T12:00:00Z",
    details: "Updated branch contact information and address.",
  },
  {
    id: "LOG-9904",
    user: "System",
    action: "LOGIN_SUCCESS",
    resource: "AUTH",
    resourceId: "USR-001",
    timestamp: "2024-02-10T09:00:00Z",
    details: "User Ahmed Mansour logged in from 192.168.1.1",
  },
  {
    id: "LOG-9905",
    user: "Laila Ibrahim",
    action: "SUBMIT_QUOTATION",
    resource: "QUOTATION",
    resourceId: "QUO-9005",
    timestamp: "2024-02-09T18:30:00Z",
    details: "Submitted financial offer for pump maintenance request.",
  },
  {
    id: "LOG-9906",
    user: "Mohammed Khalid",
    action: "REJECT_QUOTATION",
    resource: "QUOTATION",
    resourceId: "QUO-9003",
    timestamp: "2024-02-09T16:00:00Z",
    details: "Rejected quotation due to exceeding budget limits.",
  },
  {
    id: "LOG-9907",
    user: "System",
    action: "LOGIN_FAILED",
    resource: "AUTH",
    resourceId: "USR-999",
    timestamp: "2024-02-09T10:15:00Z",
    details: "Failed login attempt from unknown IP address.",
  },
];
 
export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const filteredLogs = MOCK_AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Audit Log</h1>
          <p className="text-muted-foreground">
            Comprehensive record of all administrative actions and system events.
          </p>
        </div>
        <div className="h-10 px-4 bg-muted/30 rounded-lg flex items-center gap-3 border shadow-inner">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Live Monitoring</span>
        </div>
      </div>

      <TableAuditLog
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        logs={filteredLogs}
      />
    </div>
  );
}
