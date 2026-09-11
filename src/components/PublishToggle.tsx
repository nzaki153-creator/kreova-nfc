"use client";

import { useTransition } from "react";
import { togglePublishAction } from "@/actions/profile";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/StatusBadge";

interface PublishToggleProps {
  isPublished: boolean;
}

export function PublishToggle({ isPublished }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge isPublished={isPublished} />
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => startTransition(() => togglePublishAction(isPublished))}
      >
        {isPending ? "Memproses..." : isPublished ? "Jadikan Draft" : "Publish Profil"}
      </Button>
    </div>
  );
}
