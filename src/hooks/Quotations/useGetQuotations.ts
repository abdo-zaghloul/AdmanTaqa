import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";
import type {
  QuotationItem,
  QuotationsListData,
  QuotationsListResponse,
} from "@/types/quotation";

const toQuotation = (raw: unknown): QuotationItem | null => {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.id !== "number" || typeof row.serviceRequestId !== "number") {
    return null;
  }
  return {
    id: row.id,
    serviceRequestId: row.serviceRequestId,
    serviceProviderOrganizationId:
      typeof row.serviceProviderOrganizationId === "number"
        ? row.serviceProviderOrganizationId
        : null,
    submittedByUserId:
      typeof row.submittedByUserId === "number" ? row.submittedByUserId : null,
    status: typeof row.status === "string" ? row.status : "SUBMITTED",
    createdAt: typeof row.createdAt === "string" ? row.createdAt : new Date().toISOString(),
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : undefined,
    QuotationPricing:
      row.QuotationPricing && typeof row.QuotationPricing === "object"
        ? (row.QuotationPricing as QuotationItem["QuotationPricing"])
        : null,
  };
};

const normalizeQuotations = (
  payload: unknown,
  page: number,
  limit: number
): QuotationsListData => {
  if (Array.isArray(payload)) {
    const items = payload
      .map(toQuotation)
      .filter((row): row is QuotationItem => row !== null);
    return {
      items,
      total: items.length,
      page,
      limit,
    };
  }

  if (payload && typeof payload === "object") {
    const dataObj = payload as Record<string, unknown>;

    const directItems = Array.isArray(dataObj.items) ? dataObj.items : null;
    if (directItems) {
      const items = directItems
        .map(toQuotation)
        .filter((row): row is QuotationItem => row !== null);
      return {
        items,
        total:
          typeof dataObj.total === "number" ? dataObj.total : items.length,
        page: typeof dataObj.page === "number" ? dataObj.page : page,
        limit: typeof dataObj.limit === "number" ? dataObj.limit : limit,
      };
    }

    const nestedData = dataObj.data;
    if (nestedData && typeof nestedData === "object") {
      return normalizeQuotations(nestedData, page, limit);
    }
  }

  return { items: [], total: 0, page, limit };
};

const getQuotations = async (
  page: number,
  limit: number
): Promise<QuotationsListData> => {
  try {
    const response = await axiosInstance.get<QuotationsListResponse>("quotations", {
      params: { page, limit },
    });
    return normalizeQuotations(response.data, page, limit);
  } catch (err) {
    const withResponse = err as { response?: { data?: { message?: string } } };
    const message =
      typeof withResponse.response?.data?.message === "string"
        ? withResponse.response.data.message
        : err instanceof Error
        ? err.message
        : "Failed to fetch quotations.";
    throw new Error(message);
  }
};

export default function useGetQuotations(page = 1, limit = 50) {
  return useQuery({
    queryKey: ["quotations", page, limit],
    queryFn: () => getQuotations(page, limit),
  });
}
