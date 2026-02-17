import { z } from "zod";

export const onboardingFormSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().optional(),
  content: z.string().optional(),
  order: z.number().min(0, "Order must be ≥ 0"),
  isActive: z.boolean(),
  imageUrl: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const defaultOnboardingFormValues: OnboardingFormValues = {
  title: "",
  description: "",
  content: "",
  order: 0,
  isActive: true,
  imageUrl: "",
};
