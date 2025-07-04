"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Send, FileText, User, Bot, ArrowLeft, Download, Share, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useChat } from "ai/react"
import { useUser } from "@clerk/nextjs"
import { PDFViewer } from "@/components/pdf-viewer"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatPageProps {
  params: {
    id: string
  }
}

function formatFileSize(bytes: number, decimalPoint = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimalPoint < 0 ? 0 : decimalPoint
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export default function ChatPage({ params }: ChatPageProps) {
  const { user } = useUser()
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      documentId: params.id,
    },
    onFinish: async (message) => {
      // Save chat to database
      try {
        await fetch("/api/save-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: params.id,
            messages: [...messages, message],
          }),
        })
      } catch (error) {
        console.error("Error saving chat:", error)
      }
    },
  })

  useEffect(() => {
    if (user) {
      fetchDocument()
    }
  }, [user, params.id])

  const fetchDocument = async () => {
    if (!user) return

    try {
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()

      if (docError) throw docError

      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select("messages")
        .eq("document_id", params.id)
        .eq("user_id", user.id)
        .single()

      if (chatError) throw chatError

      setDocument(docData)
      // Initialize chat with saved messages
      if (chatData.messages && chatData.messages.length > 0) {
        // Set initial messages here if needed
      }
    } catch (error) {
      console.error("Error fetching document:", error)
    } finally {
      setLoading(false)
    }
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    handleSubmit()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">{document?.name || "Loading..."}</h1>
                <p className="text-xs text-gray-500">
                  {document &&
                    `${formatFileSize(document.size)} • Uploaded ${new Date(document.created_at).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="sm:hidden">View Document Info</DropdownMenuItem>
                <DropdownMenuItem>View PDF</DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden">Export Chat</DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden">Share</DropdownMenuItem>
                <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Document</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[85vw] lg:max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-sky-400 to-blue-500"
                          : "bg-gradient-to-r from-emerald-400 to-teal-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    <Card
                      className={`${
                        message.role === "user"
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                          : "bg-white/60 backdrop-blur-sm border-sky-100"
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <p className={`text-sm ${message.role === "user" ? "text-white" : "text-gray-800"}`}>
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${message.role === "user" ? "text-sky-100" : "text-gray-500"}`}>
                          {new Date().toLocaleTimeString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-3xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <Card className="bg-white/60 backdrop-blur-sm border-sky-100">
                      <CardContent className="p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-md border-t border-sky-100">
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="pr-12 bg-white/60 backdrop-blur-sm border-sky-100"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="absolute right-1 top-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send</p>
            </div>
          </div>
        </div>

        {/* PDF Viewer Section - Hidden on mobile, visible on large screens */}
        <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-sky-100 bg-white/40 backdrop-blur-sm hidden lg:block">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-sky-100">
              <h3 className="font-semibold text-gray-800">Document Viewer</h3>
            </div>
            <div className="flex-1">
              {document?.file_url ? (
                <PDFViewer fileUrl={document.file_url} className="h-full" />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile PDF Toggle Button */}
        <div className="fixed bottom-20 right-4 lg:hidden z-10">
          <Button 
            onClick={() => window.open(document?.file_url, '_blank')}
            className="rounded-full w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg"
          >
            <FileText className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}