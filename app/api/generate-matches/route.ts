import { matchSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

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
            "You are a teacher. Create 6 matching pairs based on the document content. Each pair should have a term and its definition. Be concise and focused.",
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
  } catch (error) {
    console.error("Error generating matches:", error);
    return new Response("Error generating matches", { status: 500 });
  }
}
