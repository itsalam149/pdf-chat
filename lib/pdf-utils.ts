// lib/pdf-utils.ts

import { supabase } from "@/lib/supabase";
import Tesseract from "tesseract.js";

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

if (typeof window !== "undefined") {
  import("pdfjs-dist").then((lib) => {
    pdfjsLib = lib;
    // Force workerSrc regardless of version availability
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  });
}

/**
 * Extract text content from a PDF file using PDF.js, with fallback to OCR if needed.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PDF extraction is only supported in the browser.");
  }

  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .filter((item: any) => item.str && typeof item.str === "string")
        .map((item: any) => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    if (!fullText.trim()) throw new Error("no_text");

    return fullText.trim();
  } catch (error: any) {
    console.warn("PDF.js failed or no text found, trying OCR fallback...", error);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let ocrText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context!, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/png");

        const { data } = await Tesseract.recognize(dataUrl, "eng");
        ocrText += data.text + "\n";
      }

      ocrText = ocrText.trim();

      if (!ocrText) throw new Error("OCR failed");
      return ocrText;
    } catch (ocrError) {
      console.error("OCR also failed:", ocrError);
      throw new Error("This PDF contains only images or scanned pages. Text extraction failed.");
    }
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

/**
 * Upload a PDF to Supabase and extract its text (with OCR fallback).
 */
export async function uploadPDF(file: File, userId: string) {
  const content = await extractTextFromPDF(file);

  const { data: storageData, error: storageError } = await supabase.storage
    .from("documents")
    .upload(`${userId}/${file.name}`, file);

  if (storageError) throw storageError;

  const { data, error } = await supabase.from("documents").insert([
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