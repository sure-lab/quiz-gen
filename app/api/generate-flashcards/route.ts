import { flashcardSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

// Increase max duration for Vercel
export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    const firstFile = files[0].data;

    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Create 6 flashcards based on the document content. Each flashcard should have a question and answer. Be concise and focused.",
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
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return new Response("Error generating flashcards", { status: 500 });
  }
}
