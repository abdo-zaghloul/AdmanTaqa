import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
import { CheckCircle2, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";

export type UserRow = {
  id: number | string;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
  orgName?: string;
  status?: string;
  isActive?: boolean;
};

type UsersTableCardContentProps = {
  users: UserRow[];
};

function getRoleBadge(role?: string) {
  if (!role) return <Badge variant="secondary">—</Badge>;
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

type DropdownPlacement = { top: number; left: number; userId: string } | null;

export default function UsersTableCardContent({ users }: UsersTableCardContentProps) {
  const navigate = useNavigate();
  const [dropdownPlacement, setDropdownPlacement] = useState<DropdownPlacement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);

  useEffect(() => {
    if (!dropdownPlacement) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      setDropdownPlacement(null);
      triggerRef.current = null;
    };
    const onScroll = () => setDropdownPlacement(null);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [dropdownPlacement]);

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
                          <CheckCircle2 className={`h-2.5 w-2.5 ${(user.status ?? "ACTIVE") === "ACTIVE" ? "text-green-500" : "text-slate-400"}`} />
                          {user.status ?? "ACTIVE"}
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
                  <TableCell>{getRoleBadge(user.role ?? undefined)}</TableCell>
                  <TableCell className="text-right px-6 relative">
                    <div className="flex justify-end">
                      <Button
                        ref={(el) => {
                          if (dropdownPlacement?.userId === String(user.id))
                            triggerRef.current = el;
                        }}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          const idStr = String(user.id);
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setDropdownPlacement(
                            dropdownPlacement?.userId === idStr
                              ? null
                              : { top: rect.bottom + 4, left: rect.right - 192, userId: idStr }
                          );
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {dropdownPlacement &&
        (() => {
          const user = users.find((u) => String(u.id) === dropdownPlacement.userId);
          if (!user) return null;
          const menu = (
            <div
              ref={dropdownRef}
              className="fixed z-[100] w-48 rounded-md border bg-background shadow-lg py-1"
              style={{
                top: dropdownPlacement.top,
                left: dropdownPlacement.left,
              }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-9 px-3 py-1"
                onClick={() => {
                  navigate(`/users/${user.id}`);
                  setDropdownPlacement(null);
                }}
              >
                <Eye className="h-3.5 w-3.5 mr-2" />
                View
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-9 px-3 py-1"
                onClick={() => {
                  setEditUser(user);
                  setDropdownPlacement(null);
                }}
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm h-9 px-3 py-1 text-red-600 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  setDeleteUser(user);
                  setDropdownPlacement(null);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </Button>
            </div>
          );
          return createPortal(menu, document.body);
        })()}

      {editUser && (
        <EditUserDialog
          open={!!editUser}
          onOpenChange={(open) => { if (!open) setEditUser(null); }}
          user={{
            id: editUser.id,
            fullName: editUser.fullName,
            phone: editUser.phone,
            isActive: editUser.isActive,
          }}
        />
      )}

      <DeleteUserDialog
        open={!!deleteUser}
        onOpenChange={(open) => { if (!open) setDeleteUser(null); }}
        user={deleteUser}
      />
    </CardContent>
  );
}
