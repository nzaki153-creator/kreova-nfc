import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { getPublicProfile } from "@/lib/publicProfile";
import { PublicProfileCard } from "@/components/PublicProfileCard";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const result = await getPublicProfile(username);

  if (result.status !== "ok") {
    return {
      title: "Profile Not Found — Kreova",
      description: "Digital ID ini tidak tersedia.",
    };
  }

  const displayName = result.profile.name?.trim() || result.profile.username;

  return {
    title: `${displayName} — Digital ID`,
    description: `Digital identity of ${displayName}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const result = await getPublicProfile(username);

  if (result.status === "not_found") {
    notFound();
  }

  if (result.status === "unpublished") {
    return (
      <>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-identity-secondary">
            <UserRound className="h-7 w-7 text-identity-accent" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-lg font-semibold text-identity-primary">
            Profil belum tersedia
          </h1>
          <p className="mt-2 text-sm text-identity-primary/60">
            Pengguna ini belum membagikan identitas digitalnya.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-identity-primary/5 px-4 py-2 text-xs font-medium text-identity-primary/70 transition hover:bg-identity-primary/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Kembali
          </a>
        </div>
        <footer className="flex items-center justify-center gap-2 pb-2 text-xs text-identity-accent/70">
          <span className="h-px w-6 bg-identity-accent/20" />
          Kreova Digital Identity
          <span className="h-px w-6 bg-identity-accent/20" />
        </footer>
      </>
    );
  }

  return <PublicProfileCard profile={result.profile} />;
}
