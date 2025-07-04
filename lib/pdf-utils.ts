// lib/pdf-utils.ts

// Only import PDF.js in the browser to prevent SSR issues
let pdfjsLib: typeof import("pdfjs-dist") | null = null;

if (typeof window !== "undefined") {
  // Dynamically import pdfjsLib to ensure it's only loaded on the client
  import("pdfjs-dist").then((lib) => {
    pdfjsLib = lib;
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  });
}

/**
 * Extract text content from a PDF file using PDF.js
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PDF extraction is only supported in the browser.");
  }

  // Dynamically import if not loaded
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      if (!textContent || !textContent.items || textContent.items.length === 0) {
        console.warn(`No text content found on page ${i}`);
        continue;
      }

      const pageText = textContent.items
        .filter((item: any) => item.str && typeof item.str === "string")
        .map((item: any) => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    if (!fullText.trim()) {
      throw new Error(
        "No text content could be extracted from the PDF. The document may be scanned or contain only images."
      );
    }

    return fullText.trim();
  } catch (error: any) {
    console.error("Error extracting text from PDF:", error);
    if (error.message?.includes("worker")) {
      throw new Error("PDF processing failed. Please try again or use a different PDF.");
    }
    throw new Error("Failed to extract text from PDF. The document may be scanned or contain only images.");
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Example upload function (place in your upload handler/component)
import { supabase } from "@/lib/supabase";

export async function uploadPDF(file: File, userId: string) {
  // 1. Extract text
  const content = await extractTextFromPDF(file);

  // 2. Upload file to Supabase Storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from("pdfs")
    .upload(`${userId}/${file.name}`, file);

  if (storageError) throw storageError;

  // 3. Insert metadata into documents table
  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        user_id: userId,
        name: file.name,
        size: file.size,
        content,
        file_url: storageData.path,
      },
    ]);

  if (error) throw error;

  return data;
}
