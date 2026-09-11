import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border border-kreova-border bg-kreova-surface px-4 py-2.5 text-sm text-white placeholder:text-kreova-muted focus:border-kreova-accent focus:outline-none focus:ring-1 focus:ring-kreova-accent ${className}`}
      {...props}
    />
  );
}
