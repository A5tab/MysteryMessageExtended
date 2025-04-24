import { GoogleGenAI } from "@google/genai";
export const runtime = 'edge';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const prompt = `
      Create a list of three open-ended and engaging questions formatted as a single string. 
      Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, 
      and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes 
      that encourage friendly interaction. For example: 
      'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
      Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
    `;

    const resultStream = await ai.models.generateContentStream({
      model: "gemini-1.5-pro-latest",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of resultStream) {
          const text = chunk.toString();
          console.log("chunk",text);
          
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      }
    })

  } catch (error) {
    console.error("Streaming error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to stream response from Gemini." }),
      { status: 500 }
    );
  }
}
