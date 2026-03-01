import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Extract user-facing message from API error (e.g. 403 "Organization must be approved..."). */
export function getApiErrorMessage(error: unknown, fallback = "An error occurred."): string {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message ?? (err as Error)?.message ?? fallback;
}
