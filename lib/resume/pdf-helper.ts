/**
 * lib/resume/pdf-helper.ts
 *
 * Extracts plain text from a PDF file buffer using the modern pdfjs-dist.
 * This fixes compression errors seen in pdf-parse (which uses a 5-year-old pdf.js).
 *
 * Server-side only.
 */

// No top-level pdfjs-dist import to prevent premature evaluation of DOMMatrix
import type { TextItem } from "pdfjs-dist/types/src/display/api";

function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extracts all text from a PDF ArrayBuffer using pdfjs-dist.
 * Returns normalized plain text suitable for AI analysis.
 */
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Polyfill missing DOM elements for Vercel Node.js / Edge runtimes
    if (typeof globalThis.DOMMatrix === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      globalThis.DOMMatrix = class DOMMatrix {} as any;
    }
    if (typeof globalThis.Path2D === "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      globalThis.Path2D = class Path2D {} as any;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as any;
    const pdfjsLib = mod.default || mod;

    const data = new Uint8Array(buffer);
    
    // Initialize document without web workers (safe for Server Actions)
    const loadingTask = pdfjsLib.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
    });
    
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    let fullText = "";

    // Loop through each page and extract text
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => {
          const textItem = item as TextItem;
          return textItem.str ? textItem.str : "";
        })
        .join(" ");
        
      fullText += pageText + "\n";
    }

    if (!fullText.trim()) {
      throw new Error("No text could be extracted - file may be image-based or corrupted.");
    }

    return normalizeText(fullText);
  } catch (err) {
    console.error("[pdf-helper] pdfjs-dist extraction failed:", err);
    throw err;
  }
}
