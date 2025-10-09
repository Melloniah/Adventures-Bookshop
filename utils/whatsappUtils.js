/**
 * Generate WhatsApp URL with message
 * @param {string} message - Message to send
 * @returns {string} WhatsApp URL
 */
export function getWhatsAppUrl(message = 'Hello, I would like to inquire about...') {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254724047489';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Open WhatsApp in new tab
 */
export function openWhatsApp(message) {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}