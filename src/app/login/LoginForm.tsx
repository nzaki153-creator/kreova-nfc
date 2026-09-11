"use client";

import { useActionState } from "react";
import { signInAction, type AuthFormState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

const initialState: AuthFormState = { error: null };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" placeholder="kamu@email.com" required />
      </FormField>

      <FormField label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </FormField>

      {state.error && (
        <p className="rounded-lg bg-red-400/10 px-4 py-2.5 text-sm text-red-400 ring-1 ring-red-400/30">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
