import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Masuk — Kreova",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-kreova-gradient" />
        <span className="text-lg font-bold tracking-tight">Kreova</span>
      </div>

      <div className="rounded-xl2 border border-kreova-border bg-kreova-card p-6">
        <h1 className="text-2xl font-bold">Masuk ke akunmu</h1>
        <p className="mt-1 text-sm text-kreova-muted">
          Kelola Digital ID kamu di dashboard Kreova.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-kreova-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-kreova-accent hover:underline">
          Daftar di sini
        </Link>
      </p>
    </main>
  );
}
