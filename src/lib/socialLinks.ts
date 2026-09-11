/**
 * Mengubah nomor WhatsApp yang tersimpan menjadi link wa.me.
 * Menangani format umum di Indonesia: 08xxx, +62xxx, 62xxx.
 */
export function toWhatsAppLink(raw: string): string {
  const digitsOnly = raw.replace(/[^0-9]/g, "");
  const withCountryCode = digitsOnly.startsWith("0")
    ? `62${digitsOnly.slice(1)}`
    : digitsOnly;
  return `https://wa.me/${withCountryCode}`;
}

/**
 * Mengubah handle Instagram (mis. "@nzaki30") atau URL yang sudah lengkap
 * menjadi link instagram.com yang valid.
 */
export function toInstagramLink(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const handle = trimmed.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

/**
 * Mengembalikan URL LinkedIn apa adanya jika sudah berupa URL lengkap,
 * atau membangun URL profil jika yang tersimpan hanya slug/username.
 */
export function toLinkedInLink(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://www.linkedin.com/in/${trimmed}`;
}
