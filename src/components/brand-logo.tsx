import Image from "next/image";
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
        "flex size-12 shrink-0 items-center justify-center drop-shadow-[0_0_16px_rgba(216,183,101,0.38)]",
        className,
      )}
    >
      <Image
        src="/images/stl-musicians-mark.png"
        alt=""
        width={96}
        height={96}
        aria-hidden
        className="size-12 object-contain"
      />
    </span>
  );
}
