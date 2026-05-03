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
    <span className={cn("flex min-w-0 items-center gap-3.5", className)}>
      {mark}
      <span className="min-w-0 leading-tight">
        <span className="block text-base font-black tracking-[0.01em] text-[var(--foreground)] sm:text-lg">
          STL-Musicians.Com
        </span>
        <span className="hidden text-xs italic tracking-normal text-[var(--muted)] sm:block">
          St. Louis music. One room. All night
        </span>
      </span>
    </span>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center drop-shadow-[0_0_16px_rgba(0,47,108,0.34)]",
        className,
      )}
    >
      <svg
        aria-hidden
        className="size-9"
        fill="none"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="brand-note-stripe"
            width="18"
            height="18"
            patternTransform="rotate(35)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="18" height="18" fill="#002f6c" />
            <rect x="7" width="7" height="18" fill="#c41e3a" />
            <rect x="14" width="2" height="18" fill="#f5ead2" opacity="0.9" />
          </pattern>
        </defs>
        <path
          d="M38.5 9.5v32.2c0 7.5-6.6 12.8-14.3 12.8-6.2 0-10.8-3.5-10.8-8.7 0-6.1 5.8-10.4 13-10.4 2.4 0 4.8.5 6.8 1.4V17.2l17.1-4v7.1l-11.8 2.8Z"
          fill="url(#brand-note-stripe)"
          stroke="#f5ead2"
          strokeLinejoin="round"
          strokeWidth="4.5"
        />
        <path
          d="M33.2 18.8 50.3 15"
          stroke="#080b12"
          strokeLinecap="round"
          strokeWidth="2.75"
        />
      </svg>
    </span>
  );
}
