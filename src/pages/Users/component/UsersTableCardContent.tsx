import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  orgName: string;
  status: string;
};

type UsersTableCardContentProps = {
  users: UserRow[];
  onDeleteConfirm?: (user: UserRow) => void;
};

function getRoleBadge(role: string) {
  const variants: Record<string, string> = {
    ADMIN: "bg-blue-50 text-blue-700 border-blue-200",
    AUTHORITY: "bg-purple-50 text-purple-700 border-purple-200",
    SERVICE_PROVIDER: "bg-emerald-50 text-emerald-700 border-emerald-200",
    BRANCH_MANAGER: "bg-amber-50 text-amber-700 border-amber-200",
    TECHNICIAN: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <Badge className={`${variants[role] || "bg-gray-50"} border font-medium hover:bg-transparent shadow-none capitalize`}>
      {role.replace("_", " ").toLowerCase()}
    </Badge>
  );
}

export default function UsersTableCardContent({ users, onDeleteConfirm }: UsersTableCardContentProps) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (user: UserRow) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDeleteConfirm?.(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-foreground">User Name</TableHead>
              <TableHead className="font-bold text-foreground">Email/ID</TableHead>
              <TableHead className="font-bold text-foreground">Role</TableHead>
              <TableHead className="text-right font-bold text-foreground px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/10 transition-colors border-b last:border-0 border-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {user.fullName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{user.fullName}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className={`h-2.5 w-2.5 ${user.status === "ACTIVE" ? "text-green-500" : "text-slate-400"}`} />
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-muted-foreground text-[10px] font-mono">{user.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-right px-6">
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === user.id ? null : user.id);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>

                      {openDropdown === user.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 rounded-md border shadow-lg z-50 overflow-hidden">
                          <div className="py-1">
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm h-9 px-3 py-1"
                              onClick={() => {
                                navigate(`/users/${user.id}`);
                                setOpenDropdown(null);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm h-9 px-3 py-1"
                              onClick={() => {
                                navigate(`/users/${user.id}/edit`, { state: { userData: user } });
                                setOpenDropdown(null);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-sm h-9 px-3 py-1 text-red-600 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                handleDeleteClick(user);
                                setOpenDropdown(null);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && (setIsDeleteModalOpen(false), setUserToDelete(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user &quot;{userToDelete?.fullName}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  );
}
