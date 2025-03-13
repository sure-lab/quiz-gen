import { matchSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

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
      temperature: 0.7,
      maxTokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Create exactly 6 matching pairs based on the document content. Each pair must have a term and its definition. Be concise and focused. Keep definitions under 50 words each.",
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
    console.error("Error generating matches:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate matches" }),
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
