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
          <linearGradient id="brand-note-fill" x1="14" x2="52" y1="48" y2="16">
            <stop offset="0" stopColor="#c41e3a" />
            <stop offset="0.48" stopColor="#21314d" />
            <stop offset="1" stopColor="#002f6c" />
          </linearGradient>
        </defs>
        <path
          d="m31.5 6.8 6.8 15.1 16.2 1.9-12 11.1 3.2 16-14.2-8.2-14.1 8.2 3.1-16-12-11.1 16.2-1.9Z"
          fill="rgba(9,9,7,0.84)"
          stroke="#f5ead2"
          strokeLinejoin="round"
          strokeWidth="4.2"
        />
        <path
          d="m31.5 6.8 6.8 15.1 16.2 1.9-12 11.1 3.2 16-14.2-8.2-14.1 8.2 3.1-16-12-11.1 16.2-1.9Z"
          stroke="#d8b765"
          strokeLinejoin="round"
          strokeWidth="2.25"
        />
        <path
          d="M41.4 16.9v24.3c0 6.1-5.5 10.4-12 10.4-5.2 0-9.1-2.9-9.1-7.1 0-5.1 5-8.7 11-8.7 2.2 0 4.1.4 5.8 1.2V22.2l11.7-2.7v5.1l-7.4 1.8Z"
          fill="url(#brand-note-fill)"
          stroke="#f5ead2"
          strokeLinejoin="round"
          strokeWidth="3.25"
        />
        <path
          d="M40.2 29.5c3.9-4.6 8.1-6.9 12.8-7.2-3 2.1-4.9 4.8-5.7 8 2.7 1.4 5.5 3.5 8.1 6.3-5.7-1.9-10.6-1.3-14.7 1.8"
          stroke="#d8b765"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.6"
        />
      </svg>
    </span>
  );
}
