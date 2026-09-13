import { ArrowRight, type LucideIcon } from "lucide-react";

interface ProfileInfoRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  href?: string;
  dark?: boolean;
}

/**
 * Satu baris di Public Profile - dipakai untuk info akademik (tanpa href,
 * tidak bisa diklik) maupun action sosial (dengan href, jadi link).
 * Prop `dark` dipakai supaya baris bisa selang-seling warna
 * (espresso vs beige) sesuai urutan render di parent.
 */
export function ProfileInfoRow({ icon: Icon, label, value, href, dark = false }: ProfileInfoRowProps) {
  const baseClass = `flex items-center justify-between rounded-2xl px-5 py-4 transition ${
    dark ? "bg-identity-primary shadow-sm" : "bg-identity-secondary/50"
  }`;
  const labelClass = `flex items-center gap-3 text-sm font-medium ${
    dark ? "text-white" : "text-identity-primary"
  }`;
  const iconClass = `h-4 w-4 ${dark ? "text-white/80" : "text-identity-accent"}`;
  const valueClass = `flex items-center gap-1.5 text-xs ${
    dark ? "text-white/70" : "text-identity-accent"
  }`;

  const content = (
    <>
      <span className={labelClass}>
        <Icon className={iconClass} aria-hidden="true" />
        {label}
      </span>
      {href && (
        <span className={valueClass}>
          {value}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} active:scale-[0.98]`}
      >
        {content}
      </a>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
