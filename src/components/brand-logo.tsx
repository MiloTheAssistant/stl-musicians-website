import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "header" | "mark";
  className?: string;
};

export function BrandLogo({ variant = "header", className }: BrandLogoProps) {
  const mark = <LogoMark className={variant === "mark" ? className : undefined} />;

  if (variant === "mark") {
    return mark;
  }

  return (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      {mark}
      <span className="min-w-0 leading-tight">
        <span className="block text-sm font-black uppercase tracking-[0.08em] text-[var(--foreground)]">
          STL-Musicians.com
        </span>
        <span className="hidden text-xs text-[var(--muted)] sm:block">
          St. Louis music discovery
        </span>
      </span>
    </span>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-md border border-[rgba(216,183,101,0.55)] bg-[var(--ink)] text-[var(--brass-light)] shadow-[0_0_22px_rgba(181,139,42,0.22)]",
        className,
      )}
    >
      <svg
        aria-hidden
        className="size-8"
        fill="none"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 44h38"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4.5"
        />
        <path
          d="M18 44V20h16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
        />
        <path
          d="M30 44V20h16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4.5"
        />
        <path
          d="M46 20v24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4.5"
        />
        <path
          d="M18 32c4-5 8-7 14-7s10 2 14 7"
          stroke="var(--foreground)"
          strokeLinecap="round"
          strokeWidth="3.25"
        />
        <path
          d="M18 52c4-3 8-4.5 14-4.5S42 49 46 52"
          stroke="var(--foreground)"
          strokeLinecap="round"
          strokeWidth="3.25"
        />
      </svg>
    </span>
  );
}
