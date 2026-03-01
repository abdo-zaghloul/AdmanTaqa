import axiosInstance from "@/api/config";
import type {
  ProviderRfqItem,
  ProviderRfqDetail,
  ProviderQuoteItem,
  CreateQuoteBody,
  ProviderJobOrderItem,
  ProviderJobOrderDetail,
  ConfirmReceivedBody,
  ProviderRfqsListResponse,
  ProviderJobOrdersListResponse,
} from "@/types/provider";

function getErrorMessage(err: unknown, fallback: string): string {
  const withResponse = err as { response?: { data?: { message?: string } } };
  return typeof withResponse.response?.data?.message === "string"
    ? withResponse.response.data.message
    : err instanceof Error
      ? err.message
      : fallback;
}

export async function fetchProviderRfqs(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProviderRfqItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<ProviderRfqsListResponse>("provider/rfqs", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: ProviderRfqItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

export async function fetchProviderRfqById(id: number | string): Promise<ProviderRfqDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderRfqDetail }>(
    `provider/rfqs/${id}`
  );
  return response.data?.data ?? null;
}

export async function createQuoteForRfq(
  rfqId: number | string,
  body: CreateQuoteBody
): Promise<ProviderQuoteItem> {
  const response = await axiosInstance.post<{ success?: boolean; data?: ProviderQuoteItem }>(
    `provider/rfqs/${rfqId}/quotes`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Unexpected create quote response."));
  return item;
}

export async function reviseProviderQuote(
  quoteId: number | string,
  body: Partial<CreateQuoteBody>
): Promise<ProviderQuoteItem> {
  const response = await axiosInstance.patch<{ success?: boolean; data?: ProviderQuoteItem }>(
    `provider/quotes/${quoteId}`,
    body
  );
  const item = response.data?.data;
  if (!item) throw new Error(getErrorMessage(null, "Unexpected revise quote response."));
  return item;
}

export async function withdrawProviderQuote(quoteId: number | string): Promise<unknown> {
  const response = await axiosInstance.post(`provider/quotes/${quoteId}/withdraw`);
  return response.data;
}

export async function fetchProviderJobOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: ProviderJobOrderItem[]; total: number; page: number; limit: number }> {
  const res = await axiosInstance.get<ProviderJobOrdersListResponse>("provider/job-orders", {
    params: params ?? {},
  });
  const data = res.data?.data;
  const items = Array.isArray(data) ? data : (data as { items?: ProviderJobOrderItem[] })?.items ?? [];
  const total = (data as { total?: number })?.total ?? items.length;
  const page = (data as { page?: number })?.page ?? params?.page ?? 1;
  const limit = (data as { limit?: number })?.limit ?? params?.limit ?? 20;
  return { items, total, page, limit };
}

export async function fetchProviderJobOrderById(
  id: number | string
): Promise<ProviderJobOrderDetail | null> {
  const response = await axiosInstance.get<{ success?: boolean; data?: ProviderJobOrderDetail }>(
    `provider/job-orders/${id}`
  );
  return response.data?.data ?? null;
}

export async function confirmJobOrderPaymentReceived(
  jobOrderId: number | string,
  body: ConfirmReceivedBody
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/confirm-received`,
    body
  );
  return response.data;
}

export async function assignProviderJobOrderOperator(
  jobOrderId: number | string,
  body: { userId: number }
): Promise<unknown> {
  const response = await axiosInstance.post(
    `provider/job-orders/${jobOrderId}/assign-operator`,
    body
  );
  return response.data;
}

export async function updateProviderJobOrderStatus(
  jobOrderId: number | string,
  body: { status: string; cancellationReason?: string }
): Promise<unknown> {
  const response = await axiosInstance.patch(
    `provider/job-orders/${jobOrderId}/status`,
    body
  );
  return response.data;
}
