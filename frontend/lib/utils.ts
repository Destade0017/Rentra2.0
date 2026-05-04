import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely formats a numeric value to a localized string.
 * Fallback to 0 if the value is null or undefined.
 */
export function formatCurrency(value: number | undefined | null): string {
  return (value ?? 0).toLocaleString();
}
