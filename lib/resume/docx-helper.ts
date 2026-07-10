/**
 * lib/resume/docx-helper.ts
 *
 * Extracts plain text from a DOCX file buffer using mammoth.
 *
 * Node.js / server-side only.
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
 * Extracts all text from a DOCX ArrayBuffer.
 * Returns normalized plain text suitable for AI analysis.
 */
export async function extractTextFromDOCX(buffer: ArrayBuffer): Promise<string> {
  // Dynamic import keeps mammoth out of the client bundle
  const mammoth = await import("mammoth");

  const result = await mammoth.extractRawText({
    buffer: Buffer.from(buffer),
  });

  if (result.messages.some((m) => m.type === "error")) {
    const errors = result.messages
      .filter((m) => m.type === "error")
      .map((m) => m.message)
      .join("; ");
    throw new Error(`DOCX extraction warnings: ${errors}`);
  }

  return normalizeText(result.value);
}
