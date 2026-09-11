import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Daftar — Kreova",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-kreova-gradient" />
        <span className="text-lg font-bold tracking-tight">Kreova</span>
      </div>

      <div className="rounded-xl2 border border-kreova-border bg-kreova-card p-6">
        <h1 className="text-2xl font-bold">Buat Digital ID kamu</h1>
        <p className="mt-1 text-sm text-kreova-muted">
          Daftar sekarang, isi profil, siap ditap lewat NFC.
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-kreova-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-kreova-accent hover:underline">
          Masuk di sini
        </Link>
      </p>
    </main>
  );
}
