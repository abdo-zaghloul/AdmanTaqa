// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { ShieldCheck, ShieldAlert, Users, Lock, Pencil } from "lucide-react";

export type RoleRow = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  type: string;
};

type RoleCardsGridProps = {
  roles: RoleRow[];
  onDeleteConfirm?: (role: { id: string; name: string }) => void;
};

export default function RoleCardsGrid({ roles }: RoleCardsGridProps) {
  const navigate = useNavigate();
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const [roleToDelete, setRoleToDelete] = useState<{ id: string; name: string } | null>(null);

  // const handleDeleteClick = (role: { id: string; name: string }) => {
  //   setRoleToDelete(role);
  //   setOpenDeleteDialog(true);
  // };

  // const handleDeleteConfirm = () => {
  //   if (roleToDelete) {
  //     onDeleteConfirm?.(roleToDelete);
  //     // setOpenDeleteDialog(false);
  //     setRoleToDelete(null);
  //   }
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <Card
          key={role.id}
          className="group border-none shadow-md hover:shadow-xl transition-all flex flex-col bg-card/40 backdrop-blur-sm border border-transparent hover:border-primary/20 cursor-pointer"
          onClick={() => navigate(`/roles/${role.id}`)}
        >
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-lg ${
                  role.type === "GLOBAL" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {role.type === "GLOBAL" ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
              </div>
              <Badge variant="secondary" className="font-medium text-[10px] tracking-wider uppercase">
                {role.type}
              </Badge>
            </div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{role.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-xs">{role.description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Users className="h-3.5 w-3.5" />
              {role.userCount} Active Users
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Lock className="h-2.5 w-2.5" />
                Permissions ({role.permissions.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 3).map((perm) => (
                  <Badge
                    key={perm}
                    variant="outline"
                    className="bg-background/50 text-[10px] font-normal py-0"
                  >
                    {perm}
                  </Badge>
                ))}
                {role.permissions.length > 3 && (
                  <span className="text-[10px] text-muted-foreground px-1">
                    +{role.permissions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t bg-muted/20 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-center text-xs font-semibold hover:bg-primary/10 p-2 h-8"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/roles/${role.id}/edit`);
              }}
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </Button>
            {/* <Dialog
              open={openDeleteDialog && roleToDelete?.id === role.id}
              onOpenChange={(open) => !open && setOpenDeleteDialog(false)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-center text-xs font-semibold hover:bg-destructive/10 p-2 h-8 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(role);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Delete Role</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the role &quot;{roleToDelete?.name}&quot;? This
                    action cannot be undone and will remove this role from all users assigned to it.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDeleteDialog(false);
                      setRoleToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConfirm();
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
