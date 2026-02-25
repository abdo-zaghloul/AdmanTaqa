import axiosInstance from "@/api/config";
import { useQuery } from "@tanstack/react-query";

export interface AssetItem {
  id: number;
  branchId?: number | null;
  name?: string;
  nameEn?: string;
  nameAr?: string;
}

type GetAssetsParams = {
  branchId?: number;
};

const toObject = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const normalizeAssets = (payload: unknown): AssetItem[] => {
  const root = toObject(payload);
  const data = Array.isArray(root?.data) ? root?.data : Array.isArray(payload) ? payload : [];
  return data
    .map((raw): AssetItem | null => {
      const obj = toObject(raw);
      if (!obj || typeof obj.id !== "number") return null;
      return {
        id: obj.id,
        branchId: typeof obj.branchId === "number" ? obj.branchId : null,
        name: typeof obj.name === "string" ? obj.name : undefined,
        nameEn: typeof obj.nameEn === "string" ? obj.nameEn : undefined,
        nameAr: typeof obj.nameAr === "string" ? obj.nameAr : undefined,
      };
    })
    .filter((item): item is AssetItem => item !== null);
};

const getAssets = async (params?: GetAssetsParams): Promise<AssetItem[]> => {
  const query = params?.branchId != null ? `?branchId=${params.branchId}` : "";
  const response = await axiosInstance.get(`assets${query}`);
  return normalizeAssets(response.data);
};

export default function useGetAssets(params?: GetAssetsParams) {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAssets(params),
    enabled: params?.branchId != null,
  });
}
