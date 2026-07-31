import type { ReactNode } from "react";
import { AuthVisual } from "./AuthVisual";

type AuthShellProps = {
  children: ReactNode;
  mode: "login" | "register";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6 lg:grid lg:place-items-center lg:px-10 lg:py-10">
      <div className="mx-auto grid w-full min-w-0 max-w-[78rem] overflow-hidden rounded-[2rem] border border-border/70 bg-surface p-2 shadow-card lg:grid-cols-[0.96fr_1.04fr]">
        <AuthVisual mode={mode} />
        <section className="grid min-h-[calc(100vh-3.5rem)] min-w-0 place-items-center px-5 py-10 sm:px-12 lg:min-h-[46rem] lg:px-16">
          <div className="w-full min-w-0 max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
