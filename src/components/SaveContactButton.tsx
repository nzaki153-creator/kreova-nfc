"use client";

import { ArrowRight, UserRound } from "lucide-react";
import { buildVCard, type VCardContact } from "@/lib/vcard";

interface SaveContactButtonProps {
  contact: VCardContact;
}

export function SaveContactButton({ contact }: SaveContactButtonProps) {
  function handleSave() {
    const vcard = buildVCard(contact);
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${contact.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      className="flex w-full items-center justify-between rounded-2xl bg-identity-primary px-5 py-4 text-white shadow-sm transition active:scale-[0.98]"
    >
      <span className="flex items-center gap-3 text-sm font-semibold">
        <UserRound className="h-4 w-4" aria-hidden="true" />
        Save Contact
      </span>
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
