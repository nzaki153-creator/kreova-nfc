import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-identity-secondary">
          <UserRound className="h-7 w-7 text-identity-accent" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-lg font-semibold text-identity-primary">Profile Not Found</h1>
        <p className="mt-2 text-sm text-identity-primary/60">
          Username ini tidak terdaftar di Kreova.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-identity-primary/5 px-4 py-2 text-xs font-medium text-identity-primary/70 transition hover:bg-identity-primary/10"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Kembali
        </Link>
      </div>
      <footer className="flex items-center justify-center gap-2 pb-2 text-xs text-identity-accent/70">
        <span className="h-px w-6 bg-identity-accent/20" />
        Kreova Digital Identity
        <span className="h-px w-6 bg-identity-accent/20" />
      </footer>
    </>
  );
}
