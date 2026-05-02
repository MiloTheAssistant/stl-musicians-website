import { SignUp } from "@clerk/nextjs";
import { Eyebrow, SectionShell } from "@/components/ui";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <SectionShell className="flex min-h-[70svh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
        <Eyebrow>Join STL-Musicians.com</Eyebrow>
        {hasClerk ? (
          <div className="mt-5">
            <SignUp />
          </div>
        ) : (
          <div className="mt-5">
            <h1 className="text-3xl font-black">Account creation is wired for Clerk.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Once Clerk env vars are provisioned through Vercel, this page
              becomes the live sign-up flow for all launch roles.
            </p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
