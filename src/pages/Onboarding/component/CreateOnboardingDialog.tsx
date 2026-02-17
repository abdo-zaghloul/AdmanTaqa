import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES } from "../constants";
import {
  onboardingFormSchema,
  defaultOnboardingFormValues,
  type OnboardingFormValues,
} from "../schema";

export type CreateOnboardingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  validateImageFile: (file: File) => boolean;
  onSubmit: (data: OnboardingFormValues, imageFile: File | null) => void;
  onCancel: () => void;
  submitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  trigger: React.ReactNode;
};

export default function CreateOnboardingDialog(props: CreateOnboardingDialogProps) {
  const {
    open,
    onOpenChange,
    isDragging,
    setIsDragging,
    validateImageFile,
    onSubmit,
    onCancel,
    submitting,
    fileInputRef,
    trigger,
  } = props;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const setImageAndPreview = (file: File | null) => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setImageFile(file);
  };

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: defaultOnboardingFormValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultOnboardingFormValues);
      setImageAndPreview(null);
    }
  }, [open]);

  const handleFormSubmit = form.handleSubmit((data: OnboardingFormValues) => {
    onSubmit(data, imageFile);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setImageAndPreview(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create onboarding item</DialogTitle>
          <DialogDescription>Add a new slide or content block for onboarding.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-title">Title</Label>
            <Input
              id="create-title"
              {...form.register("title")}
              placeholder="Welcome"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-desc">Description</Label>
            <Input
              id="create-desc"
              {...form.register("description")}
              placeholder="Short description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-content">Content</Label>
            <textarea
              id="create-content"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("content")}
              placeholder="Full content (optional)"
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="space-y-2 flex-1">
              <Label htmlFor="create-order">Order</Label>
              <Controller
                control={form.control}
                name="order"
                render={({ field }) => (
                  <Input
                    id="create-order"
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {form.formState.errors.order && (
                <p className="text-sm text-destructive">{form.formState.errors.order.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="create-active"
                checked={form.watch("isActive")}
                onCheckedChange={(c) => form.setValue("isActive", !!c)}
              />
              <Label htmlFor="create-active">Active</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image (drag & drop or click)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file && validateImageFile(file)) setImageAndPreview(file);
              }}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && validateImageFile(file)) setImageAndPreview(file);
                  e.target.value = "";
                }}
              />
              {previewUrl ? (
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="max-h-40 rounded object-contain" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute -top-2 -right-2 h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); setImageAndPreview(null); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag image here or click to select (JPEG, PNG, GIF, WebP — max 5MB)</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
