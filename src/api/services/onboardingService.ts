import axiosInstance from "../config";
import type { OnboardingItem, OnboardingCreateBody, OnboardingUpdateBody } from "@/types/onboarding";

/** List onboarding items. Public: active only. Authenticated with ?all=true: all items. */
export async function fetchOnboarding(all = false): Promise<OnboardingItem[]> {
  const { data } = await axiosInstance.get<{ success: boolean; data: OnboardingItem[] }>(
    "onboarding",
    all ? { params: { all: "true" } } : undefined
  );
  return data.data ?? data ?? [];
}

export async function fetchOnboardingById(id: number | string): Promise<OnboardingItem> {
  const { data } = await axiosInstance.get<{ success: boolean; data: OnboardingItem }>(
    `onboarding/${id}`
  );
  return data.data ?? data;

}


export async function createOnboarding(body: OnboardingCreateBody): Promise<OnboardingItem> {
  const { data } = await axiosInstance.post<{ success: boolean; data: OnboardingItem }>(
    "onboarding",
    body
  );
  return data.data ?? data;
}

/** Create with image file (multipart). Field name must be `image`. */
export async function createOnboardingWithImage(formData: FormData): Promise<OnboardingItem> {
  const { data } = await axiosInstance.post<{ success: boolean; data: OnboardingItem }>(
    "onboarding",
    formData
  );
  return data.data ?? data;
}

export async function updateOnboarding(
  id: number | string,
  body: OnboardingUpdateBody
): Promise<OnboardingItem> {
  const { data } = await axiosInstance.patch<{ success: boolean; data: OnboardingItem }>(
    `onboarding/${id}`,
    body
  );
  return data.data ?? data;
}

/** Update with new image file (multipart). Field name must be `image`. */
export async function updateOnboardingWithImage(
  id: number | string,
  formData: FormData
): Promise<OnboardingItem> {
  const { data } = await axiosInstance.patch<{ success: boolean; data: OnboardingItem }>(
    `onboarding/${id}`,
    formData
  );
  return data.data ?? data;
}

export async function deleteOnboarding(id: number | string): Promise<void> {
  await axiosInstance.delete(`onboarding/${id}`);
}
