export interface OnboardingItem {
  id: number;
  title: string;
  description?: string;
  content?: string;
  order: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnboardingCreateBody {
  title: string;
  description?: string;
  content?: string;
  order?: number;
  isActive?: boolean;
  imageUrl?: string;
}

export type OnboardingUpdateBody = Partial<OnboardingCreateBody>;
