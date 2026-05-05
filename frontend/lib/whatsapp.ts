/**
 * Formats a phone number to international format for WhatsApp.
 * - Strips spaces, dashes, parentheses
 * - Removes leading 0 and prepends country code (default: 234 for Nigeria)
 * - Returns null if the number is empty or clearly invalid
 */
export function formatPhoneForWhatsApp(
  raw: string,
  countryCode = '234'
): string | null {
  const stripped = raw.replace(/[\s\-().+]/g, '');

  if (!stripped || stripped.length < 7) return null;

  // Already has a country code (starts with + or 234/1/44 etc.)
  if (stripped.startsWith(countryCode)) return stripped;

  // Remove leading zero (local format → international)
  const local = stripped.startsWith('0') ? stripped.slice(1) : stripped;

  return `${countryCode}${local}`;
}

/**
 * Builds a wa.me deep-link with a pre-filled message.
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

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens the WhatsApp link in a new tab.
 * Returns false if the phone number is missing/invalid.
 */
export function openWhatsApp(
  phone: string | undefined,
  tenantName: string,
  rentAmount: number
): boolean {
  if (!phone) return false;
  const link = buildWhatsAppLink(phone, tenantName, rentAmount);
  if (!link) return false;
  window.open(link, '_blank', 'noopener,noreferrer');
  return true;
}
