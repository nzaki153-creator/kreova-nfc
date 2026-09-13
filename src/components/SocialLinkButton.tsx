import { ArrowRight, type LucideIcon } from "lucide-react";

interface SocialLinkButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
  value?: string;
}

/**
 * Tombol/action untuk WhatsApp, Instagram, LinkedIn di Public Profile.
 * Ditampilkan sebagai baris (bukan tombol besar) - hanya dirender kalau
 * datanya memang ada, dipanggil dari PublicProfileCard.
 */
export function SocialLinkButton({ href, label, icon: Icon, value }: SocialLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-2xl bg-identity-secondary/60 px-5 py-4 text-identity-primary transition active:scale-[0.98]"
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        <Icon className="h-4 w-4 text-identity-accent" aria-hidden="true" />
        {label}
      </span>
      <span className="flex items-center gap-1.5 text-xs text-identity-accent">
        {value}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </a>
  );
}
