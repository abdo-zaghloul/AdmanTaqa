import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useGetServiceOfferingById from "@/hooks/ServiceOfferings/useGetServiceOfferingById";

type ViewServiceOfferingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: number | null | undefined;
  offeringId: number | null;
};

export default function ViewServiceOfferingDialog({
  open,
  onOpenChange,
  organizationId,
  offeringId,
}: ViewServiceOfferingDialogProps) {
  const { data: viewingResponse, isLoading } = useGetServiceOfferingById(
    organizationId ?? null,
    offeringId
  );
  // console.log(viewingResponse);

  const viewing = viewingResponse?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Service Offering Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : viewing ? (
          <div className="space-y-3 text-sm">
          
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {viewing.ServiceCategory?.nameEn }
            </p>
            <p>
              <span className="font-semibold">Governorate:</span>{" "}
              {viewing.Governorate?.name || viewing.governorateId}
            </p>
            <p>
              <span className="font-semibold">City:</span>{" "}
              {viewing.City?.name || viewing.cityId}
            </p>
            <p>
              <span className="font-semibold">Amount:</span>{" "}
              {Number(viewing.amount).toFixed(2)} {viewing.currency}
            </p>
            <p>
              <span className="font-semibold">Created:</span>{" "}
              {new Date(viewing.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Updated:</span>{" "}
              {new Date(viewing.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Offering not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
