import type { ReactNode } from "react";

/**
 * Layout ini HANYA berlaku untuk route "/u/[username]" (page, loading,
 * not-found di folder yang sama). Tema warm ivory di sini sengaja dipisah
 * dari tema dark navy yang dipakai dashboard/login/register/landing —
 * supaya redesign Public Profile tidak memengaruhi halaman lain.
 */
export default function PublicProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-identity-bg text-identity-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col px-6 py-10">
        {children}
      </div>
    </div>
  );
}
