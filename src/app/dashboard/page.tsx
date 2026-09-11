import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardForm } from "@/components/DashboardForm";
import { PublishToggle } from "@/components/PublishToggle";
import { LogoutButton } from "@/components/LogoutButton";
import type { Profile } from "@/lib/types";

export const metadata = {
  title: "My Digital ID — Kreova",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single<Profile>();

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <p className="text-sm text-red-400">
          Profil tidak ditemukan. Coba logout lalu login kembali.
        </p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-kreova-gradient" />
          <span className="text-lg font-bold tracking-tight">Kreova</span>
        </div>
        <LogoutButton />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Digital ID</h1>
          <p className="mt-1 text-sm text-kreova-muted">
            Data ini yang akan tampil saat kartu NFC kamu ditap.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <PublishToggle isPublished={profile.is_published} />
          {profile.username ? (
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-kreova-accent hover:underline"
            >
              {profile.is_published ? "View Public Profile" : "Preview Profile"}
            </a>
          ) : (
            <span className="text-sm text-kreova-muted/60">
              Isi username dulu untuk preview
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl2 border border-kreova-border bg-kreova-card p-6">
        <DashboardForm profile={profile} />
      </div>
    </main>
  );
}
