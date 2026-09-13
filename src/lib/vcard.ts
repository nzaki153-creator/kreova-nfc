import { toInstagramLink, toLinkedInLink } from "@/lib/socialLinks";

export interface VCardContact {
  name: string;
  university?: string | null;
  major?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
}

/**
 * Membangun isi file .vcf (vCard 3.0) dari data profile publik yang sudah
 * tersedia — tidak menambah data baru, hanya memformat ulang data yang ada
 * supaya bisa disimpan sebagai kontak di HP.
 */
export function buildVCard(contact: VCardContact): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${contact.name}`, `N:${contact.name};;;;`];

  if (contact.university) {
    lines.push(`ORG:${contact.university}`);
  }
  if (contact.major) {
    lines.push(`TITLE:${contact.major}`);
  }
  if (contact.whatsapp) {
    const digitsOnly = contact.whatsapp.replace(/[^0-9]/g, "");
    lines.push(`TEL;TYPE=CELL:${digitsOnly}`);
  }
  if (contact.instagram) {
    lines.push(`URL:${toInstagramLink(contact.instagram)}`);
  }
  if (contact.linkedin) {
    lines.push(`URL:${toLinkedInLink(contact.linkedin)}`);
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
