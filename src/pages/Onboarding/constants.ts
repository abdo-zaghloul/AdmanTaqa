import type { OnboardingCreateBody } from "@/types/onboarding";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const defaultForm = (): OnboardingCreateBody & { content?: string } => ({
  title: "",
  description: "",
  content: "",
  order: 0,
  isActive: true,
  imageUrl: "",
});
