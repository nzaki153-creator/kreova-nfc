import Image from "next/image";
import {
  BookOpen,
  Building2,
  Instagram,
  Linkedin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { KreovaLogo } from "@/components/KreovaLogo";
import { ProfileInfoRow } from "@/components/ProfileInfoRow";
import { toInstagramLink, toLinkedInLink, toWhatsAppLink } from "@/lib/socialLinks";
import type { PublicProfile } from "@/lib/publicProfile";

interface PublicProfileCardProps {
  profile: PublicProfile;
}

interface SocialRow {
  key: string;
  icon: LucideIcon;
  label: string;
  value?: string;
  href: string;
}

export function PublicProfileCard({ profile }: PublicProfileCardProps) {
  const displayName = profile.name?.trim() || profile.username;
  const initial = displayName[0]?.toUpperCase() ?? "?";
  const academicLine = [profile.university, profile.year].filter(Boolean).join(" · ");

  // Baris sosial saja yang selang-seling warnanya (index 0 = espresso,
  // index 1 = beige, dst). Info akademik (jurusan/universitas) tetap
  // gaya lama (selalu beige), tidak ikut pola selang-seling.
  const socialRows: SocialRow[] = [];

  if (profile.whatsapp) {
    socialRows.push({
      key: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      href: toWhatsAppLink(profile.whatsapp),
    });
  }
  if (profile.instagram) {
    socialRows.push({
      key: "instagram",
      icon: Instagram,
      label: "Instagram",
      value: profile.instagram,
      href: toInstagramLink(profile.instagram),
    });
  }
  if (profile.linkedin) {
    socialRows.push({
      key: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      href: toLinkedInLink(profile.linkedin),
    });
  }

  return (
    <>
      <header className="flex items-center gap-2">
        <KreovaLogo className="h-6 w-6" />
        <span className="text-sm font-semibold tracking-tight">Kreova</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        <div className="relative h-40 w-40 overflow-hidden rounded-[28px] bg-identity-secondary shadow-sm ring-1 ring-black/5">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={displayName}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-identity-accent">
              {initial}
            </div>
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-identity-primary">
          {displayName}
        </h1>

        {(profile.major || academicLine) && (
          <div className="mt-4 w-full space-y-2">
            {profile.major && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-identity-secondary/50 px-4 py-2.5 text-sm text-identity-primary/80">
                <BookOpen className="h-4 w-4 text-identity-accent" aria-hidden="true" />
                {profile.major}
              </div>
            )}
            {academicLine && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-identity-secondary/50 px-4 py-2.5 text-sm text-identity-primary/80">
                <Building2 className="h-4 w-4 text-identity-accent" aria-hidden="true" />
                {academicLine}
              </div>
            )}
          </div>
        )}

        {socialRows.length > 0 && (
          <div className="mt-8 w-full space-y-3">
            {socialRows.map((row, index) => (
              <ProfileInfoRow
                key={row.key}
                icon={row.icon}
                label={row.label}
                value={row.value}
                href={row.href}
                dark={index % 2 === 0}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-center gap-2 pb-2 text-xs text-identity-accent/70">
        <span className="h-px w-6 bg-identity-accent/20" />
        <KreovaLogo className="h-3.5 w-3.5" />
        Powered by Kreova
        <span className="h-px w-6 bg-identity-accent/20" />
      </footer>
    </>
  );
}
