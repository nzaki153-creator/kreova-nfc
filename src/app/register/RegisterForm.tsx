"use client";

import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

const initialState: AuthFormState = { error: null };

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" placeholder="kamu@email.com" required />
      </FormField>

      <FormField label="Password" htmlFor="password" hint="Minimal 6 karakter.">
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </FormField>

      <FormField label="Konfirmasi Password" htmlFor="confirmPassword">
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
      </FormField>

      {state.error && (
        <p className="rounded-lg bg-red-400/10 px-4 py-2.5 text-sm text-red-400 ring-1 ring-red-400/30">
          {state.error}
        </p>
      )}
      {state.info && (
        <p className="rounded-lg bg-kreova-accent/10 px-4 py-2.5 text-sm text-kreova-accent ring-1 ring-kreova-accent/30">
          {state.info}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Memproses..." : "Buat Akun"}
      </Button>
    </form>
  );
}
