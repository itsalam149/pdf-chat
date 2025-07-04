"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { extractTextFromPDF, formatFileSize } from "@/lib/pdf-utils"
import { supabase } from "@/lib/supabase"
import { useUser } from "@clerk/nextjs"

interface FileUploadProps {
  onUploadComplete?: (documentId: string) => void
  className?: string
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
}

export function FileUpload({ onUploadComplete, className }: FileUploadProps) {
  const { user } = useUser()
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) return

      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: "uploading" as const,
      }))

      setUploadFiles((prev) => [...prev, ...newFiles])

      // Process each file
      for (const uploadFile of newFiles) {
        try {
          // Update progress
          setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 25 } : f)))

          // Extract text from PDF
          setUploadFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "processing", progress: 50 } : f)),
          )

          let extractedText = "";
          try {
            extractedText = await extractTextFromPDF(uploadFile.file)
            if (!extractedText || extractedText.trim() === "") {
              throw new Error("No text could be extracted from this PDF")
            }
          } catch (extractError) {
            console.error("Text extraction error:", extractError)
            throw new Error("Failed to extract text from PDF. The document may be scanned or contain only images.")
          }

          // Upload file to Supabase Storage
          const fileExt = uploadFile.file.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}.${fileExt}`

          const { data: fileData, error: uploadError } = await supabase.storage
            .from("documents")
            .upload(fileName, uploadFile.file)

          if (uploadError) throw uploadError

          setUploadFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress: 75 } : f)))

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("documents").getPublicUrl(fileName)

          // Save document to database
          const { data: docData, error: dbError } = await supabase
            .from("documents")
            .insert({
              user_id: user.id,
              name: uploadFile.file.name,
              size: uploadFile.file.size,
              content: extractedText,
              file_url: publicUrl,
            })
            .select()
            .single()

          if (dbError) throw dbError

          // Create initial chat
          await supabase.from("chats").insert({
            document_id: docData.id,
            user_id: user.id,
            messages: [
              {
                id: "1",
                type: "assistant",
                content: `Hello! I've analyzed your PDF document "${uploadFile.file.name}". Feel free to ask me any questions about its content.`,
                timestamp: new Date().toISOString(),
              },
            ],
          })

          setUploadFiles((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f)),
          )

          onUploadComplete?.(docData.id)
        } catch (error) {
          console.error("Upload error:", error)
          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id
                ? {
                    ...f,
                    status: "error",
                    error: error instanceof Error ? error.message : "Upload failed",
                  }
                : f,
            ),
          )
        }
      }
    },
    [user, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className={className}>
      <Card className="bg-white/60 backdrop-blur-sm border-sky-100">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-sky-400 bg-sky-50" : "border-sky-200 hover:border-sky-300 hover:bg-sky-50/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isDragActive ? "Drop your PDFs here" : "Upload PDF Documents"}
            </h3>
            <p className="text-gray-600 mb-4">Drag and drop your PDF files here, or click to browse</p>
            <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
              Choose Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB per file</p>
          </div>

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800">Upload Progress</h4>
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="bg-white/40 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{uploadFile.file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {uploadFile.status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {uploadFile.status !== "completed" && uploadFile.status !== "error" && (
                    <div className="space-y-1">
                      <Progress value={uploadFile.progress} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {uploadFile.status === "uploading" && "Uploading..."}
                        {uploadFile.status === "processing" && "Processing PDF..."}
                      </p>
                    </div>
                  )}

                  {uploadFile.status === "error" && <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>}

                  {uploadFile.status === "completed" && (
                    <p className="text-xs text-green-600 mt-1">Upload completed successfully</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
