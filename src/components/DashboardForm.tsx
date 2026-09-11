"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { updateProfileAction, type ProfileFormState } from "@/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { DEMO_PROFILE, type Profile } from "@/lib/types";

interface DashboardFormProps {
  profile: Profile;
}

const initialState: ProfileFormState = { error: null, success: false };

export function DashboardForm({ profile }: DashboardFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile.photo);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-kreova-border bg-kreova-surface">
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt="Foto profil"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-kreova-muted">
              {profile.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="photo"
            className="inline-flex cursor-pointer items-center rounded-lg border border-kreova-border bg-kreova-surface px-4 py-2 text-sm text-white hover:border-kreova-accent/50"
          >
            Ganti Foto
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <p className="mt-1 text-xs text-kreova-muted/70">JPG/PNG, maks 3MB.</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nama" htmlFor="name">
          <Input
            id="name"
            name="name"
            defaultValue={profile.name ?? DEMO_PROFILE.name}
            placeholder="Nama lengkap"
            required
          />
        </FormField>

        <FormField label="Username" htmlFor="username" hint="Dipakai untuk URL profil kamu.">
          <Input
            id="username"
            name="username"
            defaultValue={profile.username ?? DEMO_PROFILE.username}
            placeholder="username"
            required
          />
        </FormField>

        <FormField label="Universitas" htmlFor="university">
          <Input
            id="university"
            name="university"
            defaultValue={profile.university ?? DEMO_PROFILE.university}
            placeholder="Nama universitas"
          />
        </FormField>

        <FormField label="Jurusan" htmlFor="major">
          <Input
            id="major"
            name="major"
            defaultValue={profile.major ?? DEMO_PROFILE.major}
            placeholder="Nama jurusan"
          />
        </FormField>

        <FormField label="Angkatan" htmlFor="year">
          <Input
            id="year"
            name="year"
            defaultValue={profile.year ?? DEMO_PROFILE.year}
            placeholder="Contoh: 2026"
          />
        </FormField>

        <FormField label="WhatsApp" htmlFor="whatsapp">
          <Input
            id="whatsapp"
            name="whatsapp"
            defaultValue={profile.whatsapp ?? DEMO_PROFILE.whatsapp}
            placeholder="Nomor WhatsApp"
          />
        </FormField>

        <FormField label="Instagram" htmlFor="instagram">
          <Input
            id="instagram"
            name="instagram"
            defaultValue={profile.instagram ?? DEMO_PROFILE.instagram}
            placeholder="@username"
          />
        </FormField>

        <FormField label="LinkedIn" htmlFor="linkedin">
          <Input
            id="linkedin"
            name="linkedin"
            defaultValue={profile.linkedin ?? DEMO_PROFILE.linkedin}
            placeholder="URL profil LinkedIn"
          />
        </FormField>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-400/10 px-4 py-2.5 text-sm text-red-400 ring-1 ring-red-400/30">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-400 ring-1 ring-emerald-400/30">
          Perubahan berhasil disimpan.
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
