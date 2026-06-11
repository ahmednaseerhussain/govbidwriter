"use client";

import { useState } from "react";
import { useActionState } from "react";
import { ChevronDown, ChevronRight, Eye, Pencil, Sparkles } from "lucide-react";
import {
  generateSectionAction,
  saveSectionAction,
  type SectionState,
} from "../actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { CopyButton } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";

type Section = {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
};

export function SectionEditor({ section }: { section: Section }) {
  const [open, setOpen] = useState(section.sortOrder === 0);
  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState(section.content);

  // Sync local draft when the server content changes (e.g. after AI generation).
  const [lastServerContent, setLastServerContent] = useState(section.content);
  if (section.content !== lastServerContent) {
    setLastServerContent(section.content);
    setDraft(section.content);
  }

  const [genState, genAction] = useActionState<SectionState, FormData>(
    generateSectionAction,
    {}
  );
  const [saveState, saveAction] = useActionState<SectionState, FormData>(
    saveSectionAction,
    {}
  );

  const hasContent = section.content.trim().length > 0;

  return (
    <Card>
      <CardHeader className="cursor-pointer py-4" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-semibold">
              {section.sortOrder + 1}. {section.title}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {hasContent ? "Drafted" : "Empty"}
          </span>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <form action={genAction}>
              <input type="hidden" name="sectionId" value={section.id} />
              <SubmitButton size="sm" variant="accent" pendingText="Generating…">
                <Sparkles className="h-3.5 w-3.5" />
                {hasContent ? "Regenerate" : "Generate draft"}
              </SubmitButton>
            </form>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreview(!preview)}
            >
              {preview ? (
                <>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" /> Preview
                </>
              )}
            </Button>
            {draft.trim() && <CopyButton text={draft} label="Copy section" />}
          </div>

          {genState.error && <Alert variant="destructive">{genState.error}</Alert>}
          {saveState.error && <Alert variant="destructive">{saveState.error}</Alert>}

          {preview ? (
            <div className="rounded-md border bg-muted/30 p-4">
              {draft.trim() ? (
                <Markdown content={draft} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nothing here yet — generate a draft or start writing.
                </p>
              )}
            </div>
          ) : (
            <form action={saveAction} className="space-y-2">
              <input type="hidden" name="sectionId" value={section.id} />
              <Textarea
                name="content"
                rows={12}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Write or generate the ${section.title} section…`}
                className="font-mono text-xs leading-relaxed"
              />
              <div className="flex items-center gap-2">
                <SubmitButton size="sm" pendingText="Saving…">
                  Save section
                </SubmitButton>
                {saveState.saved && !saveState.error && (
                  <span className="text-xs text-success">Saved.</span>
                )}
              </div>
            </form>
          )}
        </CardContent>
      )}
    </Card>
  );
}
