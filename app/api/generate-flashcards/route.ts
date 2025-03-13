import { flashcardSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Create 10 flashcards based on the document content. Each flashcard should have a question and answer.",
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
}
