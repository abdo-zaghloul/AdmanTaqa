import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import AddBranchForm from "./Component/AddBranchForm";

export default function CreateBranch() {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-bottom duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Branch</h1>
        <p className="text-muted-foreground">
          Create a new branch for your organization. Fill in the required fields.
        </p>
      </div>
      <Card className="p-6 border-none shadow-xl bg-card/60 backdrop-blur-md">
        <AddBranchForm
          onSuccess={(_, branchId) => {
            if (branchId != null) {
              navigate(`/branches/${branchId}`, { replace: true });
            } else {
              navigate("/branches", { replace: true });
            }
          }}
          onCancel={() => navigate("/branches")}
          showCancel
          submitLabel="Create Branch"
        />
      </Card>
    </div>
  );
}
