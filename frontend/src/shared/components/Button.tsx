import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inverted";
};

const variants = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-strong active:translate-y-px",
  secondary: "bg-surface-soft text-primary-strong hover:bg-tertiary/30",
  outline:
    "border border-border bg-white text-foreground hover:border-primary hover:text-primary",
  ghost: "text-foreground hover:bg-surface-soft",
  inverted: "bg-white text-primary-strong shadow-sm hover:bg-surface-soft",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
