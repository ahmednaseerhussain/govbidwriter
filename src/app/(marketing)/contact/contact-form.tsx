"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { submitContactAction, type ContactFormState } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/submit-button";

export function ContactForm() {
  const [state, formAction] = useActionState<ContactFormState, FormData>(
    submitContactAction,
    {}
  );

  if (state.sent) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-lg font-semibold text-primary">Message sent</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for reaching out — we&apos;ll get back to you within one
            business day. A confirmation was sent to your email.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name *</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="topic">Subject</Label>
            <Input id="topic" name="topic" placeholder="e.g. Question about the Pro plan" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={6}
              minLength={10}
              placeholder="How can we help?"
            />
          </div>

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText="Sending…">
            <Send className="h-4 w-4" /> Send message
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
