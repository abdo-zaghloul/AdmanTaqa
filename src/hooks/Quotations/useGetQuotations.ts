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
  const sr = row.ServiceRequest as Record<string, unknown> | undefined;
  const branch = sr?.Branch as { id?: number; nameEn?: string; nameAr?: string } | undefined;
  const srOrg = sr?.Organization as { id?: number; name?: string } | undefined;
  const org = row.Organization as { id?: number; name?: string } | undefined;
  const user = row.User as { id?: number; fullName?: string; email?: string } | undefined;
  return {
    id: row.id as number,
    serviceRequestId: row.serviceRequestId as number,
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
    ServiceRequest: sr
      ? {
          id: typeof sr.id === "number" ? sr.id : undefined,
          status: typeof sr.status === "string" ? sr.status : undefined,
          branchId: typeof sr.branchId === "number" ? sr.branchId : undefined,
          fuelStationOrganizationId:
            typeof sr.fuelStationOrganizationId === "number"
              ? sr.fuelStationOrganizationId
              : undefined,
          formData:
            sr.formData && typeof sr.formData === "object"
              ? (sr.formData as { priority?: string; description?: string })
              : undefined,
          Branch: branch
            ? {
                id: branch.id,
                nameEn: branch.nameEn,
                nameAr: branch.nameAr,
              }
            : undefined,
          Organization: srOrg ? { id: srOrg.id, name: srOrg.name } : undefined,
        }
      : undefined,
    Organization: org ? { id: org.id, name: org.name } : undefined,
    User: user
      ? { id: user.id, fullName: user.fullName, email: user.email }
      : undefined,
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
