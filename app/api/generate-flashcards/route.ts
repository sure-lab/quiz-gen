import { flashcardSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

// Increase max duration for Vercel
export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    if (!files?.[0]?.data) {
      return new Response("No file data provided", { status: 400 });
    }

    const firstFile = files[0].data;

    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      temperature: 0.7, // Add temperature for more reliable responses
      maxTokens: 1024, // Limit token length
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Create exactly 6 flashcards based on the document content. Each flashcard must have a question and answer. Be concise and focused. Keep answers under 100 words each.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create flashcards based on this document.",
            },
            {
              type: "file",
              data: firstFile,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: flashcardSchema,
      onError: (error) => {
        console.error("Streaming error:", error);
      },
    });

    const response = result.toTextStreamResponse();
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    return response;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate flashcards" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
