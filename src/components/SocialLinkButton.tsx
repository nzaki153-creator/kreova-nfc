import { type LucideIcon } from "lucide-react";

interface SocialLinkButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function SocialLinkButton({ href, label, icon: Icon }: SocialLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-xl border border-kreova-border bg-kreova-surface px-4 py-3 text-sm font-medium text-white transition hover:border-kreova-accent/50 hover:bg-kreova-card"
    >
      <Icon className="h-4 w-4 text-kreova-accent" aria-hidden="true" />
      {label}
    </a>
  );
}
