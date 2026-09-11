export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  photo: string | null;
  university: string | null;
  major: string | null;
  year: string | null;
  whatsapp: string | null;
  instagram: string | null;
  linkedin: string | null;
  username: string | null;
  is_published: boolean;
  created_at: string;
}

/**
 * Data demo default milik developer (Naufal Zaki Wirdiyan).
 * Dipakai sebagai nilai awal form dashboard saat profile masih kosong,
 * BUKAN ditulis langsung ke database saat register — supaya tidak
 * bentrok dengan constraint unique "username" jika ada beberapa akun
 * yang didaftarkan saat development/testing.
 */
export const DEMO_PROFILE = {
  name: "Naufal Zaki Wirdiyan",
  university: "Universitas Indonesia",
  major: "Sastra Indonesia",
  year: "2026",
  whatsapp: "",
  instagram: "@nzaki30",
  linkedin: "",
  username: "naufal",
} as const;
