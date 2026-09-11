import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-12 text-center">
        <p className="text-sm font-medium text-kreova-muted">
          This profile is not available.
        </p>
        <p className="mt-6 text-xs font-medium tracking-wide text-kreova-muted/50">
          Kreova
        </p>
      </main>
    );
  }

  return <PublicProfileCard profile={result.profile} />;
}
