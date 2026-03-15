import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, MapPin, Building2, Paperclip, CreditCard } from "lucide-react";
import { useQuotationsWebById } from "@/hooks/Quotations/useQuotationsWeb";

function formatDate(s: string | undefined | null): string {
  if (!s) return "—";
  return new Date(s).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function QuotationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: quote, isLoading } = useQuotationsWebById(id ?? null);

  if (isLoading || !id) {
    return (
      <div className="p-4 md:p-8 flex justify-center min-h-[200px] items-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-4 md:p-8 space-y-4">
        <Button variant="ghost" asChild>
          <Link to="/quotations">Back</Link>
        </Button>
        <p className="text-destructive">Quote not found.</p>
      </div>
    );
  }

  const ext = quote.ExternalRequest;
  const branch = ext?.Branch;
  const org = ext?.Organization;
  const asset = ext?.Asset;
  const area = ext?.Area;
  const city = ext?.City;
  const branchName = branch?.nameEn ?? branch?.nameAr ?? "—";
  const attachments = quote.attachments ?? [];
  const paymentTerms = quote.QuotePaymentTerms ?? [];
  const revisions = quote.ProviderQuoteRevisions ?? [];
  const formData = ext?.formData as
    | { title?: string; priority?: string; description?: string; attachments?: unknown[] }
    | undefined;
  const latestRevision = revisions.length > 0
    ? revisions.slice().sort((a, b) => (b.version ?? 0) - (a.version ?? 0))[0]
    : null;
  const pricingJson = latestRevision?.pricingJson as
    | {
        notes?: string;
        amount?: number;
        currency?: string;
        timeline?: string;
        warranty?: string;
        laborCost?: number;
        scopeOfWork?: string;
        materialCost?: number;
        technicalProposal?: string;
      }
    | undefined;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/quotations" className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to offers
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quote #{quote.id}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="secondary">{quote.status ?? "—"}</Badge>
            {quote.version != null && (
              <span className="text-muted-foreground">Version {quote.version}</span>
            )}
            {quote.paymentType && (
              <span className="text-muted-foreground">Payment: {quote.paymentType}</span>
            )}
            {quote.createdAt && (
              <span className="text-muted-foreground">Created {formatDate(quote.createdAt)}</span>
            )}
          </div>
          {quote.rejectionReason && (
            <p className="text-sm text-destructive mt-2">Rejection: {quote.rejectionReason}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {ext && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Request / Branch
              </h3>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <p>Request ID: {ext.id ?? "—"}</p>
                <p>Branch: {branchName}</p>
                {ext.address && <p>Address: {ext.address}</p>}
                {org?.name && (
                  <p className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" /> Station / Org: {org.name}
                  </p>
                )}
                {asset?.name && <p>Asset: {asset.name}</p>}
                {area?.name && <p>Area: {area.name}</p>}
                {city?.name && <p>City: {city.name}</p>}
              </div>
            </div>
          )}

          {formData && (
            <div className="space-y-3 pt-2 border-t">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" /> Request details (formData)
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {formData.title != null && formData.title !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium">Title</dt>
                    <dd>{formData.title}</dd>
                  </>
                )}
                {formData.priority != null && formData.priority !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium">Priority</dt>
                    <dd>{formData.priority}</dd>
                  </>
                )}
                {formData.description != null && formData.description !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium sm:col-span-1">Description</dt>
                    <dd className="sm:col-span-1">{formData.description}</dd>
                  </>
                )}
                {Array.isArray(formData.attachments) && formData.attachments.length > 0 && (
                  <>
                    <dt className="text-muted-foreground font-medium">Attachments</dt>
                    <dd>{formData.attachments.length} file(s)</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {pricingJson && (
            <div className="space-y-3 pt-2 border-t">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Pricing details
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {pricingJson.amount != null && (
                  <>
                    <dt className="text-muted-foreground font-medium">Amount</dt>
                    <dd>{pricingJson.amount}{pricingJson.currency ? ` ${pricingJson.currency}` : ""}</dd>
                  </>
                )}
                {pricingJson.laborCost != null && (
                  <>
                    <dt className="text-muted-foreground font-medium">Labor cost</dt>
                    <dd>{pricingJson.laborCost}{pricingJson.currency ? ` ${pricingJson.currency}` : ""}</dd>
                  </>
                )}
                {pricingJson.materialCost != null && (
                  <>
                    <dt className="text-muted-foreground font-medium">Material cost</dt>
                    <dd>{pricingJson.materialCost}{pricingJson.currency ? ` ${pricingJson.currency}` : ""}</dd>
                  </>
                )}
                {pricingJson.timeline != null && pricingJson.timeline !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium">Timeline</dt>
                    <dd>{pricingJson.timeline}</dd>
                  </>
                )}
                {pricingJson.warranty != null && pricingJson.warranty !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium">Warranty</dt>
                    <dd>{pricingJson.warranty}</dd>
                  </>
                )}
                {pricingJson.scopeOfWork != null && pricingJson.scopeOfWork !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium">Scope of work</dt>
                    <dd>{pricingJson.scopeOfWork}</dd>
                  </>
                )}
                {pricingJson.technicalProposal != null && pricingJson.technicalProposal !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium">Technical proposal</dt>
                    <dd>{pricingJson.technicalProposal}</dd>
                  </>
                )}
                {pricingJson.notes != null && pricingJson.notes !== "" && (
                  <>
                    <dt className="text-muted-foreground font-medium sm:col-span-1">Notes</dt>
                    <dd className="sm:col-span-1">{pricingJson.notes}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {paymentTerms.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment terms
              </h3>
              <ul className="text-sm space-y-1">
                {paymentTerms.map((term, i) => (
                  <li key={i}>
                    Seq {term.sequence ?? i + 1}: {term.percent ?? 0}% — {term.trigger ?? "—"}
                    {term.note && ` (${term.note})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Paperclip className="h-4 w-4" /> Attachments
              </h3>
              <ul className="text-sm space-y-1">
                {attachments.map((a) => (
                  <li key={a.id ?? a.fileName}>
                    {a.fileUrl ? (
                      <a
                        href={a.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline"
                      >
                        {a.fileName ?? "Attachment"}
                      </a>
                    ) : (
                      <span>{a.fileName ?? "Attachment"}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {revisions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Revisions</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {revisions.map((r) => (
                  <li key={r.id}>
                    Version {r.version} — {r.submittedAt ? formatDate(r.submittedAt) : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
