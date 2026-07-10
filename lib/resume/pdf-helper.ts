/**
 * lib/resume/pdf-helper.ts
 *
 * Extracts plain text from a PDF file buffer using pdf-parse.
 *
 * Uses the lib entry point (pdf-parse/lib/pdf-parse.js) instead of
 * the main entry, which tries to load test files that don't exist
 * in bundled Next.js environments.
 *
 * Server-side only.
 */

/**
 * Normalizes raw text by collapsing whitespace and trimming.
 */
function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extracts all text from a PDF ArrayBuffer.
 * Returns normalized plain text suitable for AI analysis.
 */
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Use the internal lib path to bypass pdf-parse's test-file
    // initialization that fails in Next.js / Turbopack bundled environments.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = await import("pdf-parse/lib/pdf-parse.js" as any);
    const pdfParse = mod.default ?? mod;

    const nodeBuffer = Buffer.from(buffer);
    console.log("[pdf-helper] buffer size:", nodeBuffer.length, "bytes");

    const data = await pdfParse(nodeBuffer);
    console.log("[pdf-helper] extracted text length:", data?.text?.length ?? 0);

    if (!data?.text) {
      throw new Error("pdf-parse returned empty text — file may be image-based or corrupted.");
    }

    return normalizeText(data.text);
  } catch (err) {
    // Log the real error so it's visible in the server terminal
    console.error("[pdf-helper] extraction failed:", err);
    throw err;
  }
}
