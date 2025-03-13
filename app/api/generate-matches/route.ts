import { matchSchema } from "@/lib/schemas";
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
          "You are a teacher. Create 10 matching pairs based on the document content. Each pair should have a term and its definition.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create matching pairs based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: matchSchema,
  });

  return result.toTextStreamResponse();
}
