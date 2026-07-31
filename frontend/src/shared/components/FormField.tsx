import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  action?: ReactNode;
  error?: string;
};

export function FormField({
  label,
  icon,
  action,
  error,
  id,
  className = "",
  ...props
}: FormFieldProps) {
  return (
    <div className="grid min-w-0 gap-2 text-sm font-semibold text-foreground">
      <div className="flex items-center justify-between">
        <label htmlFor={id}>{label}</label>
        {action}
      </div>
      <span
        className={`flex min-h-13 min-w-0 items-center gap-3 rounded-xl border bg-surface px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 ${
          error ? "border-danger" : "border-border"
        } ${className}`}
      >
        <span className="shrink-0 text-muted" aria-hidden="true">
          {icon}
        </span>
        <input
          id={id}
          className="min-w-0 flex-1 border-0 bg-transparent py-3 font-normal outline-none placeholder:text-muted/70"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </span>
      {error && (
        <span id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </span>
      )}
    </div>
  );
}
