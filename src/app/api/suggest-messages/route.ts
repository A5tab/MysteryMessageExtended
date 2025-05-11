import { GoogleGenAI } from "@google/genai";
export const runtime = 'edge';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST() {
  try {
    const prompt = `
      Generate a list of three bold, playful, and slightly savage messages in Roman Urdu, formatted as a single string using '||' as separators.
      Each message should be directed toward the receiver — like a roast, flirty taunt, or brutally honest feedback. Avoid questions. Make it feel like a friend, classmate, or secret admirer is sending an anonymous message with no filter.
      Keep the tone cheeky, humorous, and bold — like teasing someone’s looks, vibes, overconfidence, thirst traps, or drama. Use Pakistani cultural references to make it relatable and fun.
      The messages should feel like: “tu bara scene hai, par confidence zyada hai”, “tera hairstyle bilkul morning show wali aunty jaisa hai”, or “itni thirsty stories post karta hai, paani bhi sharma jaye”.
      Stay ethical and non-explicit, but don't be tame. Make them spicy enough to start a laugh, flirt, or argument.
      Don't give initial responses like here got list of message or such things, just the list of messages.
`;


    const resultStream = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: prompt,
    });


    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of resultStream) {
          controller.enqueue(new TextEncoder().encode(chunk.text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

  } catch (error) {
    console.error("Streaming error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to stream response from Gemini." }),
      { status: 500 }
    );
  }
}
