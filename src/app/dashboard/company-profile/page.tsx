import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { parseStringArray } from "@/lib/json";
import { ProfileForm } from "./profile-form";
import { CapabilityGenerator } from "./capability-generator";

export const metadata: Metadata = { title: "Company Profile" };

export default async function CompanyProfilePage() {
  const user = await requireUser();
  const profile = await db.companyProfile.findUnique({
    where: { userId: user.id },
  });

  const defaults = {
    companyName: profile?.companyName ?? "",
    website: profile?.website ?? "",
    ownerName: profile?.ownerName ?? "",
    email: profile?.email ?? user.email,
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    uei: profile?.uei ?? "",
    cageCode: profile?.cageCode ?? "",
    naicsCodes: parseStringArray(profile?.naicsCodes).join(", "),
    certifications: parseStringArray(profile?.certifications).join(", "),
    setAsides: parseStringArray(profile?.setAsides).join(", "),
    services: profile?.services ?? "",
    differentiators: profile?.differentiators ?? "",
    pastPerformance: profile?.pastPerformance ?? "",
    teamBios: profile?.teamBios ?? "",
    serviceAreas: profile?.serviceAreas ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything GovBidWriter generates is grounded in this profile — the
          more complete it is, the better your capability statements and
          proposal drafts.
        </p>
      </div>

      <ProfileForm defaults={defaults} />

      <CapabilityGenerator hasProfile={Boolean(profile?.companyName)} />
    </div>
  );
}
