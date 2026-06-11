import "server-only";

/**
 * PDF text extraction abstraction.
 *
 * Current implementation: pdf-parse (pure JS, serverless-safe). The import
 * targets lib/pdf-parse.js directly to avoid the package's debug-mode index
 * which reads a test fixture at import time.
 *
 * Swap implementations here (e.g. unpdf, external OCR service) without
 * touching call sites.
 */

export const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB

export type PdfExtractionResult =
  | { ok: true; text: string; pages: number }
  | { ok: false; error: string };

export function isPdfMagicBytes(buffer: Buffer): boolean {
  // "%PDF-"
  return (
    buffer.length > 5 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

export async function extractPdfText(
  buffer: Buffer
): Promise<PdfExtractionResult> {
  if (buffer.length > MAX_PDF_BYTES) {
    return { ok: false, error: "PDF exceeds the 10MB size limit." };
  }
  if (!isPdfMagicBytes(buffer)) {
    return { ok: false, error: "File is not a valid PDF." };
  }
  try {
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const result = await pdfParse(buffer);
    const text = (result.text || "").trim();
    if (text.length < 100) {
      return {
        ok: false,
        error:
          "Could not extract readable text — this PDF may be scanned images. Paste the RFP text instead.",
      };
    }
    return { ok: true, text, pages: result.numpages ?? 0 };
  } catch {
    return {
      ok: false,
      error:
        "Failed to parse this PDF. Try re-saving it or paste the RFP text instead.",
    };
  }
}
