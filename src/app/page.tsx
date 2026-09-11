import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-10 sm:max-w-lg">
      <header className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-kreova-gradient" />
        <span className="text-lg font-bold tracking-tight">Kreova</span>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-8 py-16">
        <div className="space-y-4">
          <span className="inline-block rounded-full border border-kreova-border bg-kreova-card px-3 py-1 text-xs font-medium text-kreova-accent">
            NFC Digital Identity Card
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Identitas digital mahasiswa,{" "}
            <span className="bg-kreova-gradient bg-clip-text text-transparent">
              cukup satu tap.
            </span>
          </h1>
          <p className="text-base leading-relaxed text-kreova-muted">
            Tap kartu NFC Kreova ke HP, profil digitalmu langsung tampil. Tanpa app,
            tanpa ribet — cukup satu identitas yang selalu bisa dibagikan.
          </p>
        </div>

        <div className="rounded-xl2 border border-kreova-border bg-kreova-card p-5">
          <p className="text-sm font-medium text-white">Profil digitalmu berisi:</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-kreova-muted">
            <li>• Foto & Nama</li>
            <li>• Universitas</li>
            <li>• Jurusan</li>
            <li>• Angkatan</li>
            <li>• WhatsApp</li>
            <li>• Instagram & LinkedIn</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className="flex-1">
            <Button className="w-full">Buat Digital ID</Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button variant="secondary" className="w-full">
              Masuk
            </Button>
          </Link>
        </div>
      </section>

      <footer className="text-center text-xs text-kreova-muted/60">
        © {new Date().getFullYear()} Kreova. Dibuat untuk mahasiswa Indonesia.
      </footer>
    </main>
  );
}
