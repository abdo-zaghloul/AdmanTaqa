import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, Building2, MapPin, Calendar, Hash, Briefcase, CreditCard, Info } from "lucide-react";
import useProviderRfqById from "@/hooks/Provider/useProviderRfqById";
import { getQuotePaymentTerms } from "@/types/provider";

function formatDate(s: string | undefined): string {
  if (!s) return "—";
  return new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** Human-readable label for payment trigger (from backend). */
function paymentTriggerLabel(trigger: string | undefined): string {
  if (!trigger) return "—";
  const map: Record<string, string> = {
    ON_APPROVAL: "On quote approval (when station selects this quote)",
    ON_JOB_START: "When job starts",
    ON_COMPLETION_SUBMITTED: "When completion is submitted",
    ON_JOB_CLOSED: "When job is closed",
  };
  return map[trigger] ?? trigger;
}

/** Resolve pricing details from quote: either pricingDetails (flattened API) or latest ProviderQuoteRevision.pricingJson. */
function getQuotePricingDetails(q: {
  pricingDetails?: Record<string, unknown>;
  ProviderQuoteRevisions?: Array<{ pricingJson?: Record<string, unknown> }>;
}): Record<string, unknown> | undefined {
  if (q.pricingDetails && Object.keys(q.pricingDetails).length > 0) return q.pricingDetails;
  const revisions = q.ProviderQuoteRevisions;
  if (Array.isArray(revisions) && revisions.length > 0) {
    const latest = revisions.slice().sort((a, b) => ((b as { version?: number }).version ?? 0) - ((a as { version?: number }).version ?? 0))[0];
    if (latest?.pricingJson && Object.keys(latest.pricingJson).length > 0) return latest.pricingJson;
  }
  return undefined;
}

export default function ProviderRfqDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: rfq, isLoading } = useProviderRfqById(id ?? null);
  const quotes = rfq?.ProviderQuotes ?? rfq?.quotes ?? [];
  const selectedQuote = quotes.find((q: { status?: string }) => q.status === "SELECTED");
  const externalJobOrder = selectedQuote?.ExternalJobOrder ?? (selectedQuote as { ExternalJobOrder?: { id?: number; PaymentRecord?: { status?: string; receiptFileUrl?: string | null } } | null })?.ExternalJobOrder ?? null;

  const title = rfq?.formData?.title ?? rfq?.title ?? `RFQ #${rfq?.id}`;
  const description = rfq?.formData?.description ?? rfq?.description;
  const priority = rfq?.formData?.priority;

  const paymentRecord = (externalJobOrder as { PaymentRecord?: { status?: string; receiptFileUrl?: string | null } } | null)?.PaymentRecord;
  const receiptFileUrl = paymentRecord?.receiptFileUrl ?? undefined;

  const branch = rfq?.Branch ?? (rfq as { branch?: { id?: number; nameEn?: string; nameAr?: string; address?: string; street?: string; latitude?: string; longitude?: string } })?.branch;
  const org = rfq?.Organization ?? (rfq as { organization?: { id?: number; name?: string } })?.organization;
  const area = rfq?.Area ?? (rfq as { area?: { id?: number; name?: string } })?.area;
  const city = rfq?.City ?? (rfq as { city?: { id?: number; name?: string } })?.city;

  return (
    <div className="p-4 md:p-8">
      {isLoading || !id ? (
        <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
          Loading...
        </div>
      ) : !rfq ? (
        <>
          <Button variant="ghost" asChild>
            <Link to="/provider-rfqs">Back</Link>
          </Button>
          <p className="text-destructive">RFQ not found.</p>
        </>
      ) : (
        <div className="space-y-6">
          <Button variant="ghost" asChild>
            <Link to="/provider-rfqs" className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Link>
          </Button>

          {branch && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" />
                  Branch
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="font-medium">{branch.nameEn ?? branch.nameAr ?? (branch.id != null ? `Branch #${branch.id}` : "—")}</p>
                {branch.address && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {branch.address}
                    {branch.street && `, ${branch.street}`}
                  </p>
                )}
                {(branch.latitude || branch.longitude) && (
                  <p className="text-muted-foreground text-xs">
                    {[branch.latitude, branch.longitude].filter(Boolean).join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {(org || area || city) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization & location</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {org && <p><span className="text-muted-foreground">Organization:</span> {org.name ?? (org.id != null ? `#${org.id}` : "—")}</p>}
                {area && <p><span className="text-muted-foreground">Area:</span> {area.name ?? (area.id != null ? `#${area.id}` : "—")}</p>}
                {city && <p><span className="text-muted-foreground">City:</span> {city.name ?? (city.id != null ? `#${city.id}` : "—")}</p>}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                {title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary">{rfq.status ?? "—"}</Badge>
                {priority && <span className="text-muted-foreground">Priority: {priority}</span>}
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {formatDate(rfq.createdAt)}
                </span>
                {rfq.updatedAt && rfq.updatedAt !== rfq.createdAt && (
                  <span className="text-muted-foreground">Updated {formatDate(rfq.updatedAt)}</span>
                )}
              </div>

              {/* <p className="text-xs text-muted-foreground mt-1">
                ID {rfq.id}
                {rfq.branchId != null && ` · Branch ${rfq.branchId}`}
                {rfq.fuelStationOrganizationId != null && ` · Station org ${rfq.fuelStationOrganizationId}`}
                {rfq.areaId != null && ` · Area ${rfq.areaId}`}
              </p> */}

            </CardHeader>
            {externalJobOrder?.id != null && (
              <div className="ms-6 pt-2 pb-2 border-b">
                <Button size="sm" variant="outline" className="gap-2" asChild>
                  <Link to={`/provider-job-orders/${externalJobOrder.id}`}>
                    <Briefcase className="h-4 w-4" />
                    Job Order
                  </Link>
                </Button>
              </div>
            )}
            {receiptFileUrl && (
              <div className="ms-6 pt-2 pb-2 border-b space-y-2">
                <p className="text-sm font-medium">Payment receipt</p>
                <a
                  href={receiptFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg border overflow-hidden bg-muted/30 max-w-[280px]"
                >
                  <img
                    src={receiptFileUrl}
                    alt="Payment receipt"
                    className="w-full h-auto object-contain max-h-64"
                  />
                </a>
                <p className="text-xs text-muted-foreground">
                  <a href={receiptFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Open receipt in new tab
                  </a>
                </p>
              </div>
            )}
            <CardContent className="space-y-4">
              {description && rfq.status !== "AWAITING_PAYMENT" && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
                  <p className="text-sm mt-1">{description}</p>
                </div>
              )}

              {rfq.status !== "AWAITING_PAYMENT" && (
                <>
                  {quotes.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Your quotes</p>
                      <ul className="space-y-2">
                        {quotes.map((q: {
                          id: number;
                          status?: string;
                          amount?: number;
                          validUntil?: string;
                          paymentType?: string;
                          pricingDetails?: {
                            amount?: number;
                            currency?: string;
                            notes?: string;
                            timeline?: string;
                            warranty?: string;
                            laborCost?: number;
                            scopeOfWork?: string;
                            materialCost?: number;
                            technicalProposal?: string;
                            [key: string]: unknown;
                          };
                        }) => {
                          const quotePaymentTerms = getQuotePaymentTerms(q as Parameters<typeof getQuotePaymentTerms>[0]);
                          const paymentType = q.paymentType ?? (quotePaymentTerms.length > 0 ? "INSTALLMENTS" : undefined);
                          const pd = getQuotePricingDetails(q as Parameters<typeof getQuotePricingDetails>[0]);
                          const amount = (pd?.amount as number | undefined) ?? q.pricingDetails?.amount ?? q.amount;
                          const currency = (pd?.currency as string | undefined) ?? q.pricingDetails?.currency;
                          const hasPricingDetails = pd && Object.keys(pd).length > 0;
                          return (
                            <li
                              key={q.id}
                              className="flex flex-col gap-2 rounded border px-3 py-2 text-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span>
                                  #{q.id}
                                  {amount != null ? ` · ${amount}${currency ? ` ${currency}` : ""}` : ""}
                                  {q.validUntil ? ` · Valid until ${String(q.validUntil).slice(0, 10)}` : ""}
                                  {paymentType ? ` · ${paymentType.replace(/_/g, " ")}` : ""}
                                </span>
                                <div className="flex items-center gap-2">
                                  {q.status === "REJECTED" && <Badge variant="destructive">Rejected</Badge>}
                                  {q.status === "WITHDRAWN" && <Badge variant="secondary">Withdrawn</Badge>}
                                  {q.status === "ACCEPTED" && <Badge variant="default">Accepted</Badge>}
                                  {q.status === "SELECTED" && <Badge variant="default">Selected</Badge>}
                                </div>
                              </div>

                              {hasPricingDetails && (
                                <div className="mt-2 pt-2 border-t border-muted/50 space-y-2">
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Pricing details
                                  </p>
                                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                                    {pd.amount != null && (
                                      <>
                                        <dt className="text-muted-foreground">Amount</dt>
                                        <dd>{String(pd.amount)}{pd.currency ? ` ${String(pd.currency)}` : ""}</dd>
                                      </>
                                    )}
                                    {pd.laborCost != null && (
                                      <>
                                        <dt className="text-muted-foreground">Labor cost</dt>
                                        <dd>{String(pd.laborCost)}{pd.currency ? ` ${String(pd.currency)}` : ""}</dd>
                                      </>
                                    )}
                                    {pd.materialCost != null && (
                                      <>
                                        <dt className="text-muted-foreground">Material cost</dt>
                                        <dd>{String(pd.materialCost)}{pd.currency ? ` ${String(pd.currency)}` : ""}</dd>
                                      </>
                                    )}
                                    {pd.timeline != null && pd.timeline !== "" && (
                                      <>
                                        <dt className="text-muted-foreground">Timeline</dt>
                                        <dd>{String(pd.timeline)}</dd>
                                      </>
                                    )}
                                    {pd.warranty != null && pd.warranty !== "" && (
                                      <>
                                        <dt className="text-muted-foreground">Warranty</dt>
                                        <dd>{String(pd.warranty)}</dd>
                                      </>
                                    )}
                                    {pd.scopeOfWork != null && pd.scopeOfWork !== "" && (
                                      <>
                                        <dt className="text-muted-foreground">Scope of work</dt>
                                        <dd>{String(pd.scopeOfWork)}</dd>
                                      </>
                                    )}
                                    {pd.technicalProposal != null && pd.technicalProposal !== "" && (
                                      <>
                                        <dt className="text-muted-foreground">Technical proposal</dt>
                                        <dd>{String(pd.technicalProposal)}</dd>
                                      </>
                                    )}
                                    {pd.notes != null && pd.notes !== "" && (
                                      <>
                                        <dt className="text-muted-foreground sm:col-span-1">Notes</dt>
                                        <dd className="sm:col-span-1">{String(pd.notes)}</dd>
                                      </>
                                    )}
                                  </dl>
                                </div>
                              )}

                              {quotePaymentTerms.length > 0 && (
                                <div className="w-full mt-1 pt-2 border-t border-muted/50 space-y-2">
                                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Payment terms (installments)
                                  </p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="border-muted/50 hover:bg-transparent">
                                        <TableHead className="text-xs font-medium">#</TableHead>
                                        <TableHead className="text-xs font-medium">Percent</TableHead>
                                        <TableHead className="text-xs font-medium">When due</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {quotePaymentTerms
                                        .slice()
                                        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
                                        .map((term) => (
                                          <TableRow key={term.id ?? term.sequence ?? 0} className="border-muted/50">
                                            <TableCell className="text-xs py-1">{term.sequence ?? "—"}</TableCell>
                                            <TableCell className="text-xs py-1">{term.percent ?? "—"}%</TableCell>
                                            <TableCell className="text-xs py-1">{paymentTriggerLabel(term.trigger)}</TableCell>
                                          </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                  <div className="flex gap-1.5 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                    <span>
                                      Payment is made in {quotePaymentTerms.length} installment{quotePaymentTerms.length !== 1 ? "s" : ""}. The fuel station confirms &quot;payment sent&quot; for each milestone; you then confirm &quot;received&quot; (or reject with a reason). Until both confirm, the job stays in AWAITING_PAYMENT.
                                    </span>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
