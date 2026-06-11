import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create your free account",
  robots: { index: false },
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <h1 className="text-xl font-bold">Create your free account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        3 free AI generations per month. No credit card required.
      </p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
