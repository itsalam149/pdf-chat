import { supabase } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { documentId, messages } = await req.json()

    // Update chat messages in database
    const { error } = await supabase
      .from("chats")
      .update({
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq("document_id", documentId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error saving chat:", error)
      return new Response("Failed to save chat", { status: 500 })
    }

    return new Response("Chat saved successfully")
  } catch (error) {
    console.error("Save chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
