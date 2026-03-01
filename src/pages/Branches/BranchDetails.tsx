import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Phone,
  Loader2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import useGetBranchesDetails from "@/hooks/Branches/useGetBranchesDetails";
import BranchLocationMap from "./Component/BranchLocationMap";

function DetailsLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
      <Loader2 className="h-10 w-10 animate-spin" />
      <p className="text-sm font-medium">Loading branch...</p>
    </div>
  );
}

function DetailsError({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="text-sm font-medium text-center max-w-md text-muted-foreground">{message}</p>
      <Button variant="link" onClick={onBack}>
        Back to Branches
      </Button>
    </div>
  );
}

function DetailsNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
      <p className="text-sm font-medium">Branch not found.</p>
      <Button variant="link" onClick={onBack}>
        Back to Branches
      </Button>
    </div>
  );
}

export default function BranchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: branch, isLoading, isError, error } = useGetBranchesDetails(id);

  const handleBack = () => navigate("/branches");

  const name = branch?.nameEn || branch?.nameAr || (branch ? String(branch.id) : "");
  const location = branch?.Area?.name ? `${branch.Area.name}${branch.address ? `, ${branch.address}` : ""}` : (branch?.address ?? "—");
  const isActive = branch ? branch.status === "APPROVED" && branch.isActive : false;
  const hasCoordinates =
    branch != null &&
    branch.latitude != null &&
    branch.longitude != null &&
    !Number.isNaN(parseFloat(String(branch.latitude))) &&
    !Number.isNaN(parseFloat(String(branch.longitude)));

  return (
    <div className="p-4 md:p-8">
      {isLoading ? (
        <DetailsLoading />
      ) : isError ? (
        <DetailsError
          message={error instanceof Error ? error.message : "Failed to load branch."}
          onBack={handleBack}
        />
      ) : !branch ? (
        <DetailsNotFound onBack={handleBack} />
      ) : (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="Back to branches"
            className="rounded-full shadow-sm border border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{name}</h1>
              <Badge
                variant={isActive ? "default" : "secondary"}
                className={`shadow-none font-bold text-[10px] ${isActive ? "bg-green-600 hover:bg-green-600" : ""}`}
              >
                {isActive ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {branch.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">{branch.id}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium">Org #{branch.organizationId}</span>
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
          <Link to={`/branches/${branch.id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit Branch
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Location
                    </p>
                    <p className="text-sm font-bold text-slate-800">{location}</p>
                    {branch.street && <p className="text-xs text-slate-500 mt-1">{branch.street}</p>}
                    {hasCoordinates && (
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {String(branch.latitude)}, {String(branch.longitude)}
                      </p>
                    )}
                  </div>
                  <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      Contact
                    </p>
                    <p className="text-sm font-bold text-slate-800">{branch.managerPhone ?? "—"}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      Manager
                    </p>
                    <p className="text-sm font-bold text-slate-800">{branch.managerName ?? "—"}</p>
                    {branch.managerEmail && (
                      <p className="text-xs text-slate-500 mt-1">{branch.managerEmail}</p>
                    )}
                  </div>
                  <div className="group p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Created
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(branch.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              {branch.FuelStationType && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Station Type
                  </p>
                  <p className="text-sm font-bold text-slate-800">{branch.FuelStationType.name}</p>
                  {branch.FuelStationType.code && (
                    <Badge variant="outline" className="mt-1 text-xs">{branch.FuelStationType.code}</Badge>
                  )}
                </div>
              )}
              {(branch.FuelTypes ?? []).length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    Fuel Types
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {branch.FuelTypes!.map((ft) => (
                      <Badge key={ft.id} variant="secondary">
                        {ft.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {hasCoordinates && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Map
                  </p>
                  <BranchLocationMap
                    latitude={String(branch.latitude)}
                    longitude={String(branch.longitude)}
                    readOnly
                    height="220px"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardHeader className="border-b bg-slate-50/50 py-4">
              <CardTitle className="text-md">Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium">{branch.licenseNumber ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{branch.status}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Active</span>
                <span className="font-medium">{branch.isActive ? "Yes" : "No"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      )}
    </div>
  );
}
