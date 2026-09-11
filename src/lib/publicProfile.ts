import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface PublicProfile {
  name: string | null;
  photo: string | null;
  university: string | null;
  major: string | null;
  year: string | null;
  whatsapp: string | null;
  instagram: string | null;
  linkedin: string | null;
  username: string;
}

export type PublicProfileResult =
  | { status: "ok"; profile: PublicProfile }
  | { status: "unpublished" }
  | { status: "not_found" };

/**
 * Mengambil profile publik berdasarkan username.
 * Dibungkus React `cache()` supaya generateMetadata() dan halaman itu
 * sendiri tidak melakukan query yang sama dua kali dalam satu request.
 *
 * Hanya mengambil field yang memang perlu ditampilkan ke publik —
 * tidak menyertakan id, user_id, created_at, dsb.
 */
export const getPublicProfile = cache(
  async (username: string): Promise<PublicProfileResult> => {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "name, photo, university, major, year, whatsapp, instagram, linkedin, username",
      )
      .eq("username", username)
      .eq("is_published", true)
      .maybeSingle<PublicProfile>();

    if (profile) {
      return { status: "ok", profile };
    }

    // RLS menyembunyikan baris yang belum published, jadi query di atas
    // akan kosong baik untuk username yang tidak ada maupun yang belum
    // publish. Untuk membedakan pesan errornya, cek lewat fungsi khusus
    // yang hanya mengembalikan true/false (tidak membocorkan data profile).
    const { data: exists } = await supabase.rpc("profile_exists", {
      check_username: username,
    });

    return exists === true ? { status: "unpublished" } : { status: "not_found" };
  },
);
