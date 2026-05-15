import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ComponentProps<typeof Link> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]",
        variant === "primary" &&
          "bg-[var(--brass)] text-[var(--ink)] hover:bg-[var(--brass-light)]",
        variant === "secondary" &&
          "border border-[var(--line)] bg-[rgba(245,234,210,0.08)] text-[var(--foreground)] hover:bg-[rgba(245,234,210,0.14)]",
        variant === "ghost" &&
          "text-[var(--muted)] hover:bg-[rgba(245,234,210,0.08)] hover:text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--brass-light)]">
      {children}
    </p>
  );
}

export function SectionShell({
  children,
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--line)] bg-[rgba(245,234,210,0.06)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
      {children}
    </span>
  );
}
