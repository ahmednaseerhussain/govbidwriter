"use client";

import { useActionState } from "react";
import { saveCompanyProfileAction, type ProfileFormState } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubmitButton } from "@/components/submit-button";

type Defaults = Record<string, string>;

function Field({
  name,
  label,
  defaults,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaults: Defaults;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        defaultValue={defaults[name]}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function AreaField({
  name,
  label,
  defaults,
  placeholder,
  rows = 3,
}: {
  name: string;
  label: string;
  defaults: Defaults;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaults[name]}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

export function ProfileForm({ defaults }: { defaults: Defaults }) {
  const [state, formAction] = useActionState<ProfileFormState, FormData>(
    saveCompanyProfileAction,
    {}
  );

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company details</CardTitle>
          <CardDescription>
            Lists (NAICS codes, certifications) can be comma separated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && <Alert variant="destructive">{state.error}</Alert>}
          {state.saved && <Alert variant="success">Profile saved.</Alert>}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="companyName" label="Company name *" defaults={defaults} required placeholder="Acme Federal Services LLC" />
            <Field name="website" label="Website" defaults={defaults} placeholder="https://example.com" />
            <Field name="ownerName" label="Owner / capture lead" defaults={defaults} placeholder="Jane Contractor" />
            <Field name="email" label="Contact email" defaults={defaults} />
            <Field name="phone" label="Phone" defaults={defaults} placeholder="(555) 555-0100" />
            <Field name="address" label="Address" defaults={defaults} placeholder="123 Main St, Austin, TX" />
            <Field name="uei" label="UEI" defaults={defaults} placeholder="ABC123DEF456" />
            <Field name="cageCode" label="CAGE code" defaults={defaults} placeholder="1AB23" />
            <Field name="naicsCodes" label="NAICS codes" defaults={defaults} placeholder="541511, 541512" />
            <Field name="certifications" label="Certifications" defaults={defaults} placeholder="8(a), WOSB, ISO 9001" />
            <Field name="setAsides" label="Set-aside eligibility" defaults={defaults} placeholder="Small Business, SDVOSB, HUBZone" />
            <Field name="serviceAreas" label="Service areas" defaults={defaults} placeholder="Texas, nationwide remote" />
          </div>

          <AreaField name="services" label="Services you provide" defaults={defaults} placeholder={"One per line:\nCustom software development\nIT help desk support"} rows={4} />
          <AreaField name="differentiators" label="Differentiators" defaults={defaults} placeholder="What makes you the lower-risk choice — certifications, response times, niche expertise…" />
          <AreaField name="pastPerformance" label="Past performance" defaults={defaults} placeholder={"One project per line with scope and outcome:\nVA help desk support, 2023–2025 — 98% SLA attainment"} rows={4} />
          <AreaField name="teamBios" label="Key team bios" defaults={defaults} placeholder="Short bios of key personnel, one per line." />

          <SubmitButton pendingText="Saving…">Save profile</SubmitButton>
        </CardContent>
      </Card>
    </form>
  );
}
