/** Provider (Service Provider) — RFQs, quotes, job orders, confirm received */

export interface ProviderRfqItem {
  id: number;
  externalRequestId?: number;
  title?: string;
  description?: string | null;
  status?: string;
  createdAt?: string;
  quotes?: ProviderQuoteItem[];
}

export interface ProviderRfqDetail extends ProviderRfqItem {
  branchId?: number | null;
  stationOrganizationId?: number;
}

export interface ProviderQuoteItem {
  id: number;
  rfqId?: number;
  providerOrganizationId?: number;
  amount?: number;
  validUntil?: string;
  status?: string;
  createdAt?: string;
}

export interface CreateQuoteBody {
  amount: number;
  validUntil?: string;
  [key: string]: unknown;
}

export interface ProviderJobOrderItem {
  id: number;
  externalRequestId?: number;
  status?: string;
  paymentRecord?: PaymentRecordSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecordSummary {
  id?: number;
  status?: string;
  rejectionReason?: string | null;
}

export interface ProviderJobOrderDetail extends ProviderJobOrderItem {
  title?: string;
  description?: string | null;
  selectedQuoteId?: number;
}

export interface ConfirmReceivedBody {
  confirm: boolean;
  note?: string;
  rejectionReason?: string;
}

export interface ProviderRfqsListResponse {
  success?: boolean;
  data?: ProviderRfqItem[] | { items?: ProviderRfqItem[]; total?: number; page?: number; limit?: number };
  message?: string;
}

export interface ProviderJobOrdersListResponse {
  success?: boolean;
  data?:
    | ProviderJobOrderItem[]
    | { items?: ProviderJobOrderItem[]; total?: number; page?: number; limit?: number };
  message?: string;
}
