import Image from "next/image";

interface KreovaLogoProps {
  className?: string;
}

/**
 * Logo asli Kreova (public/logo.png). className mengatur ukuran tampil
 * (mis. "h-6 w-6"), rasio gambar dijaga lewat mode "fill" di dalam
 * container relative.
 */
export function KreovaLogo({ className = "h-6 w-6" }: KreovaLogoProps) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-full ${className}`}>
      <Image src="/logo.png" alt="Kreova" fill sizes="32px" className="object-cover" />
    </span>
  );
}
