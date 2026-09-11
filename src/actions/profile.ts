"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProfileFormState {
  error: string | null;
  success: boolean;
}

const MAX_PHOTO_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi berakhir. Silakan login kembali.", success: false };
  }

  const name = String(formData.get("name") ?? "").trim();
  const university = String(formData.get("university") ?? "").trim();
  const major = String(formData.get("major") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();

  if (!name) {
    return { error: "Nama wajib diisi.", success: false };
  }
  if (!username) {
    return { error: "Username wajib diisi.", success: false };
  }
  if (!/^[a-z0-9_-]+$/.test(username)) {
    return {
      error: "Username hanya boleh huruf kecil, angka, tanda hubung (-), dan underscore (_).",
      success: false,
    };
  }

  let photoUrl: string | undefined;

  const photoFile = formData.get("photo");
  if (photoFile instanceof File && photoFile.size > 0) {
    if (photoFile.size > MAX_PHOTO_SIZE_BYTES) {
      return { error: "Ukuran foto maksimal 3MB.", success: false };
    }

    const extension = photoFile.name.split(".").pop() ?? "jpg";
    const filePath = `${user.id}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, photoFile, { upsert: true });

    if (uploadError) {
      return { error: `Gagal mengunggah foto: ${uploadError.message}`, success: false };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Tambahkan cache-buster supaya foto baru langsung tampil setelah upsert.
    photoUrl = `${publicUrl}?updated=${Date.now()}`;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      name,
      university: university || null,
      major: major || null,
      year: year || null,
      whatsapp: whatsapp || null,
      instagram: instagram || null,
      linkedin: linkedin || null,
      username,
      ...(photoUrl ? { photo: photoUrl } : {}),
    })
    .eq("user_id", user.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return { error: "Username sudah dipakai. Coba username lain.", success: false };
    }
    return { error: updateError.message, success: false };
  }

  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function togglePublishAction(currentStatus: boolean): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("profiles")
    .update({ is_published: !currentStatus })
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}
