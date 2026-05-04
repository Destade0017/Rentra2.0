import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely formats a numeric value to a localized string.
 * Handles numbers, strings, and nullish values.
 */
export function formatCurrency(value: number | string | undefined | null): string {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return (isNaN(num) ? 0 : num).toLocaleString();
}
