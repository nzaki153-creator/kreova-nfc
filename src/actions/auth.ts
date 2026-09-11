"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error: string | null;
  info?: string | null;
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email || !password || !confirmPassword) {
    return { error: "Semua field wajib diisi." };
  }
  if (password !== confirmPassword) {
    return { error: "Password dan konfirmasi password tidak sama." };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Gagal membuat akun. Silakan coba lagi." };
  }

  // Baris "profiles" untuk user ini otomatis dibuat oleh trigger database
  // "on_auth_user_created" (lihat supabase/schema.sql), jadi tidak perlu
  // insert manual di sini.

  if (!data.session) {
    // Project Supabase ini mewajibkan konfirmasi email, jadi belum ada
    // session aktif. Tidak bisa langsung ke /dashboard (akan ditolak middleware).
    return {
      error: null,
      info: "Akun berhasil dibuat. Cek email kamu untuk konfirmasi akun, lalu login.",
    };
  }

  redirect("/dashboard");
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email atau password salah." };
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
