/**
 * Saudi phone validation: fixed prefix +966, user enters 9 digits (5xxxxxxxx).
 */

export const SAUDI_PHONE_PREFIX = "+966";

export const SAUDI_PHONE_ERROR_MESSAGE =
  "Enter a valid Saudi mobile number (9 digits starting with 5)";

const SAUDI_MOBILE_DIGITS_REGEX = /^5[0-9]{8}$/;

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Validates the 9-digit part only (no +966). Empty = valid for optional fields.
 */
export function isValidSaudiPhoneDigits(value: string): boolean {
  const s = value.trim().replace(/\s/g, "");
  if (s === "") return true;
  const d = digitsOnly(s);
  return SAUDI_MOBILE_DIGITS_REGEX.test(d);
}

/**
 * Returns full number for API: +966 + 9 digits (digits normalized from input).
 */
export function toFullSaudiPhone(digitsOnlyInput: string): string {
  const d = digitsOnly(digitsOnlyInput.trim());
  return SAUDI_PHONE_PREFIX + d;
}

/**
 * From stored/display value (e.g. +966501234567 or 0501234567), extract the 9 digits for the input field.
 */
export function parseDisplayToDigits(value: string | null | undefined): string {
  if (value == null || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  let d = digitsOnly(trimmed);
  if (d.startsWith("966")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 9);
}
