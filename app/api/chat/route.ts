import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { messages, documentId } = await req.json()

    // Get document content from database
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("content, name")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single()

    if (docError || !document) {
      return new Response("Document not found", { status: 404 })
    }

    // Check if document content is available
    if (!document.content || document.content.trim() === "") {
      return new Response("Document has no extractable text content", { status: 422 })
    }

    // Create system message with document context
    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful AI assistant that answers questions about PDF documents. 
      
      The user has uploaded a document titled "${document.name}". Here is the content of the document:
      
      ${document.content}
      
      Please answer questions based on this document content. Be helpful, accurate, and cite specific parts of the document when relevant. If a question cannot be answered from the document content, politely explain that the information is not available in the provided document.`,
    }

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
