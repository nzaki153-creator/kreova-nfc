import Image from "next/image";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { SocialLinkButton } from "@/components/SocialLinkButton";
import { toInstagramLink, toLinkedInLink, toWhatsAppLink } from "@/lib/socialLinks";
import type { PublicProfile } from "@/lib/publicProfile";

interface PublicProfileCardProps {
  profile: PublicProfile;
}

export function PublicProfileCard({ profile }: PublicProfileCardProps) {
  const displayName = profile.name?.trim() || profile.username;
  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-xl2 border border-kreova-border bg-kreova-card p-8 text-center shadow-2xl shadow-black/40">
        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-kreova-border bg-kreova-surface">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={displayName}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-kreova-gradient text-3xl font-bold text-white">
              {initial}
            </div>
          )}
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight">{displayName}</h1>

        <div className="mt-2 space-y-0.5 text-sm text-kreova-muted">
          {profile.major && <p>{profile.major}</p>}
          {profile.university && <p>{profile.university}</p>}
          {profile.year && <p>Angkatan {profile.year}</p>}
        </div>

        <div className="mt-8 space-y-3">
          {profile.whatsapp && (
            <SocialLinkButton
              href={toWhatsAppLink(profile.whatsapp)}
              label="WhatsApp"
              icon={MessageCircle}
            />
          )}
          {profile.instagram && (
            <SocialLinkButton
              href={toInstagramLink(profile.instagram)}
              label="Instagram"
              icon={Instagram}
            />
          )}
          {profile.linkedin && (
            <SocialLinkButton
              href={toLinkedInLink(profile.linkedin)}
              label="LinkedIn"
              icon={Linkedin}
            />
          )}
        </div>
      </div>

      <p className="mt-6 text-xs font-medium tracking-wide text-kreova-muted/50">Kreova</p>
    </main>
  );
}
