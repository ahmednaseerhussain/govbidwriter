"use client";

import { useState } from "react";
import { useActionState } from "react";
import { FileUp, ClipboardPaste } from "lucide-react";
import { createRfpAction, type RfpFormState } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/submit-button";
import { cn } from "@/lib/utils";

export function RfpUploadForm() {
  const [mode, setMode] = useState<"pdf" | "paste">("pdf");
  const [state, formAction] = useActionState<RfpFormState, FormData>(
    createRfpAction,
    {}
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
          {(
            [
              { id: "pdf", label: "Upload PDF", icon: FileUp },
              { id: "paste", label: "Paste text", icon: ClipboardPaste },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                mode === tab.id
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="mode" value={mode} />

          <div className="space-y-1.5">
            <Label htmlFor="title">RFP title (optional)</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Janitorial Services — Building 4, Fort Example"
            />
          </div>

          {mode === "pdf" ? (
            <div className="space-y-1.5">
              <Label htmlFor="file">Solicitation PDF (max 10MB)</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf,.pdf"
                className="h-auto cursor-pointer py-2"
              />
              <p className="text-xs text-muted-foreground">
                Works best with text-based PDFs. If your document is scanned
                images, switch to “Paste text”.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="text">RFP text</Label>
              <Textarea
                id="text"
                name="text"
                rows={12}
                placeholder="Paste the solicitation text here — include Sections L and M and the statement of work if you have them."
              />
            </div>
          )}

          {state.error && <Alert variant="destructive">{state.error}</Alert>}

          <SubmitButton pendingText={mode === "pdf" ? "Extracting text…" : "Saving…"}>
            Add RFP
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
