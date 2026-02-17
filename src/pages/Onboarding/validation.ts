import type { OnboardingCreateBody } from "@/types/onboarding";

export type OnboardingFormErrors = Partial<Record<keyof OnboardingCreateBody | "content", string>>;

type FormState = OnboardingCreateBody & { content?: string };

/**
 * Validates onboarding form for create/update.
 * Returns an object of field keys to error messages (empty = valid).
 */
export function validateOnboardingForm(form: FormState): OnboardingFormErrors {
  const errors: OnboardingFormErrors = {};

  const title = (form.title ?? "").trim();
  if (!title) {
    errors.title = "Title is required";
  }

  const order = form.order;
  if (typeof order !== "number" || order < 0) {
    errors.order = "Order must be a number ≥ 0";
  }

  return errors;
}

export function hasValidationErrors(errors: OnboardingFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
