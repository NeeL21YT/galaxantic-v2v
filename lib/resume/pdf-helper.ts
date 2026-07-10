/**
 * lib/resume/pdf-helper.ts
 *
 * Extracts plain text from a PDF file buffer using pdf2json.
 * This completely avoids Vercel Turbopack errors related to Web Workers, Canvas,
 * and DOMMatrix that plague pdfjs-dist on Serverless/Edge runtimes.
 *
 * Server-side only.
 */

import PDFParser from "pdf2json";

function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extracts all text from a PDF ArrayBuffer using pdf2json.
 * Returns normalized plain text suitable for AI analysis.
 */
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Initialize pdf2json in "raw text extraction" mode (1)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParser = new PDFParser(null, 1 as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        const errorMsg = errData?.parserError || errData?.message || String(errData);
        console.error("[pdf-helper] extraction failed:", errorMsg);
        reject(new Error(String(errorMsg)));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const rawText = pdfParser.getRawTextContent();
        if (!rawText || !rawText.trim()) {
          return reject(new Error("No text could be extracted - file may be image-based or corrupted."));
        }
        resolve(normalizeText(rawText));
      });

      const nodeBuffer = Buffer.from(buffer);
      pdfParser.parseBuffer(nodeBuffer);
    } catch (err) {
      console.error("[pdf-helper] fatal parse error:", err);
      reject(err);
    }
  });
}
