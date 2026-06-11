// Helpers for the JSON-as-String columns (SQLite/Postgres portability — see ARCHITECTURE.md).

export function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
    return [];
  } catch {
    return [];
  }
}

export function toJsonString(value: string[] | null | undefined): string {
  return JSON.stringify(value ?? []);
}

/** Split comma/newline separated user input into a clean string array. */
export function splitList(input: string | null | undefined): string[] {
  if (!input) return [];
  return input
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
