import React from "react";

/**
 * Minimal, dependency-free Markdown renderer for AI-generated drafts.
 * Supports headings, bold/italic, lists, and blockquotes. Renders via React
 * elements only (no dangerouslySetInnerHTML), so AI/user content stays safe.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // bold (**x**) then italic (*x* or _x_)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>);
    } else if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      nodes.push(<em key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</em>);
    } else {
      nodes.push(part);
    }
  });
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length) {
      blocks.push(
        <ul key={`ul-${key++}`} className="my-3 list-disc space-y-1 pl-6">
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const listMatch = line.match(/^\s*[-*]\s+(.*)/);
    const numMatch = line.match(/^\s*\d+\.\s+(.*)/);
    if (listMatch || numMatch) {
      listItems.push((listMatch ?? numMatch)![1]);
      continue;
    }
    flushList();
    if (!line.trim()) continue;

    if (line.startsWith("#### ")) {
      blocks.push(<h5 key={key++} className="mt-4 mb-1 font-semibold">{renderInline(line.slice(5), `h-${key}`)}</h5>);
    } else if (line.startsWith("### ")) {
      blocks.push(<h4 key={key++} className="mt-5 mb-2 text-base font-semibold">{renderInline(line.slice(4), `h-${key}`)}</h4>);
    } else if (line.startsWith("## ")) {
      blocks.push(<h3 key={key++} className="mt-6 mb-2 text-lg font-bold">{renderInline(line.slice(3), `h-${key}`)}</h3>);
    } else if (line.startsWith("# ")) {
      blocks.push(<h2 key={key++} className="mt-6 mb-3 text-xl font-bold">{renderInline(line.slice(2), `h-${key}`)}</h2>);
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote key={key++} className="my-3 border-l-4 border-muted-foreground/30 pl-4 text-sm text-muted-foreground">
          {renderInline(line.slice(2), `q-${key}`)}
        </blockquote>
      );
    } else {
      blocks.push(
        <p key={key++} className="my-2 leading-relaxed">
          {renderInline(line, `p-${key}`)}
        </p>
      );
    }
  }
  flushList();

  return <div className="text-sm text-foreground">{blocks}</div>;
}
