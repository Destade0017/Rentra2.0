/**
 * Formats a phone number to international format for WhatsApp.
 * - Strips all non-digit characters
 * - Ensures no leading zero after country code
 * - Prepends country code (default: 234 for Nigeria)
 * - Returns null if the number is clearly invalid
 */
export function formatPhoneForWhatsApp(
  raw: string,
  countryCode = '234'
): string | null {
  if (!raw) return null;

  // Strip everything except digits
  let digits = raw.replace(/\D/g, '');

  if (!digits || digits.length < 7) return null;

  // Handle leading zero (e.g. 0803... -> 803...)
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Handle case where user entered country code + leading zero (e.g. 2340803... -> 234803...)
  if (digits.startsWith(countryCode + '0')) {
    digits = countryCode + digits.slice(countryCode.length + 1);
  }

  // Prepend country code if not present
  if (!digits.startsWith(countryCode)) {
    digits = countryCode + digits;
  }

  return digits;
}

/**
 * Builds a wa.me link with a pre-filled message.
 * Returns null when the phone number cannot be formatted.
 */
export function buildWhatsAppLink(
  phone: string,
  tenantName: string,
  rentAmount: number,
  countryCode = '234'
): string | null {
  const number = formatPhoneForWhatsApp(phone, countryCode);
  if (!number) return null;

  const message =
    `Hello ${tenantName}, this is a friendly reminder that your monthly rent ` +
    `of ₦${rentAmount.toLocaleString()} is due. ` +
    `Kindly make payment at your earliest convenience. Thank you! 🏠`;

  // Standard wa.me format: https://wa.me/number?text=message
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens the WhatsApp link in a new tab.
 */
export function openWhatsApp(
  phone: string | undefined,
  tenantName: string,
  rentAmount: number
): boolean {
  if (!phone) return false;
  const link = buildWhatsAppLink(phone, tenantName, rentAmount);
  if (!link) return false;
  
  // Open in new tab
  window.open(link, '_blank', 'noopener,noreferrer');
  return true;
}
