import { type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({ label, htmlFor, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-kreova-muted">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-kreova-muted/70">{hint}</p>}
    </div>
  );
}
