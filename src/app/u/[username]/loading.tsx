export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="h-16 w-16 animate-pulse rounded-full bg-identity-secondary" />
      <div className="mt-6 h-3 w-32 animate-pulse rounded-full bg-identity-secondary" />
      <div className="mt-3 h-3 w-24 animate-pulse rounded-full bg-identity-secondary" />
      <div className="mt-3 h-3 w-28 animate-pulse rounded-full bg-identity-secondary" />
      <p className="mt-6 text-xs text-identity-accent/60">Memuat profil...</p>
    </div>
  );
}
