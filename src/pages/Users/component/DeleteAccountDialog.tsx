import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDeleteAccount from "@/hooks/Users/useDeleteAccount";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
};

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  userId,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = useState("");
  const deleteAccountMutation = useDeleteAccount();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Enter your password to confirm.");
      return;
    }
    deleteAccountMutation.mutate(
      { userId, password },
      {
        onSuccess: () => {
          toast.success("Account deactivated successfully.");
          onOpenChange(false);
        },
        onError: (e) =>
          toast.error((e as Error)?.message ?? "Failed to delete account."),
      }
    );
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setPassword("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Delete my account</DialogTitle>
            <DialogDescription>
              This will deactivate your account. You will not be able to sign in again. Enter your current password to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="delete-account-password">Current password</Label>
            <Input
              id="delete-account-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={deleteAccountMutation.isPending || !password.trim()}
            >
              {deleteAccountMutation.isPending ? "Deactivating..." : "Delete my account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
