import { ButtonLink, SectionShell } from "@/components/ui";

export default function NotFound() {
  return (
    <SectionShell>
      <h1 className="text-5xl font-black">This part of the stage is dark.</h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">
        The page you requested is not part of the current STL-Musicians.com launch.
      </p>
      <ButtonLink href="/" className="mt-8">Return home</ButtonLink>
    </SectionShell>
  );
}
