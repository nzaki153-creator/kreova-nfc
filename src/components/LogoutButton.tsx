"use client";

import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="secondary">
        Logout
      </Button>
    </form>
  );
}
