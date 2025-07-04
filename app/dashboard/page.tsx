"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { FileUpload } from "@/components/file-upload";
import { supabase } from "@/lib/supabase";
import { formatFileSize, extractTextFromPDF } from "@/lib/pdf-utils"; // ✅ Import PDF text extractor

interface PDFFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  lastChat: string;
  messageCount: number;
  thumbnail?: string;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select(`id, name, size, created_at, chats ( messages, updated_at )`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedFiles: PDFFile[] = data.map((doc) => ({
        id: doc.id,
        name: doc.name,
        size: formatFileSize(doc.size),
        uploadDate: doc.created_at,
        lastChat: doc.chats?.[0]?.updated_at
          ? new Date(doc.chats[0].updated_at).toLocaleDateString()
          : "No chats yet",
        messageCount: doc.chats?.[0]?.messages?.length || 0,
      }));

      setFiles(formattedFiles);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (file: File) => {
    if (!user || !file) return;
    setIsUploading(true);

    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { data: storageData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error("Failed to get public URL");

      const fileText = await extractTextFromPDF(file); // ✅ Use PDF.js-based extraction

      const { error: insertError } = await supabase.from("documents").insert({
        user_id: user.id,
        name: file.name,
        size: file.size,
        content: fileText,
        file_url: publicUrl,
      });

      if (insertError) {
        console.error("Insert Error:", insertError);
        throw insertError;
      }

      await fetchDocuments();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        "Failed to upload PDF. Please make sure it's not a scanned image or corrupted."
      );
    } finally {
      setIsUploading(false);
      setShowUpload(false);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter((file) => file.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                  PDFChat
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload PDF
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Upload PDF Documents</h2>
                <Button variant="ghost" onClick={() => setShowUpload(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6">
                <FileUpload
                  onUploadComplete={async () => {
                    setShowUpload(false);
                    await fetchDocuments();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/60 backdrop-blur-sm border-sky-100">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Total Documents
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-800">
                      {files.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-sm border-sky-100"
            />
          </div>
          <Button
            variant="outline"
            className="border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </motion.div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-sky-100 hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </CardTitle>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/chat/${file.id}`}
                            className="flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Open Chat
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        Uploaded:{" "}
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </span>
                      <span>{file.messageCount} messages</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last chat: {file.lastChat}
                    </div>
                  </div>

                  <Link href={`/chat/${file.id}`}>
                    <Button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Continue Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Upload your first PDF to get started"}
            </p>
            <Button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
