import { useState } from "react";
import { Card } from "@/components/ui/card";
import JobOrdersTableHeader from "./Component/JobOrdersTableHeader";
import TableJobOrders from "./Component/TableJobOrders";
import useGetJobOrders from "@/hooks/JobOrders/useGetJobOrders";

export default function JobOrders() {
  const [page] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading, isError, error } = useGetJobOrders({ page, limit });
  const orders = data?.items ?? [];

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Orders</h1>
          <p className="text-muted-foreground">
            Track ongoing maintenance and installation tasks.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
        <JobOrdersTableHeader />
        {isLoading ? (
          <div className="flex justify-center py-16 text-muted-foreground">
            Loading job orders...
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 mx-4 my-6 text-destructive">
            {(error as Error)?.message ?? "Failed to load job orders."}
          </div>
        ) : (
          <TableJobOrders orders={orders} />
        )}
      </Card>
    </div>
  );
}
