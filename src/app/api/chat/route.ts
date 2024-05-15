import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import { ollama, streamText } from "modelfusion";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Use ModelFusion to call Ollama:
  const textStream = await streamText({
    model: ollama
      .ChatTextGenerator({ model: "llama3", temperature: 0.4 })
      .withChatPrompt(),
    prompt: {
      system:
        "Eres un asistente de inteligencia artificial de habla hispana llamado Jarvis" +
        "entrega la respuesta en formato de markdown y sigue las instrucciones del usuario cuidadosamente.",

      // map Vercel AI SDK Message to ModelFusion ChatMessage:
      messages: asChatMessages(messages),
    },
  });

  // Return the result using the Vercel AI SDK:
  return new StreamingTextResponse(
    ModelFusionTextStream(
      textStream,
      // optional callbacks:
      {
        onStart() {
          console.log("onStart");
        },
        onToken(token) {
          console.log("onToken", token);
        },
        onCompletion: () => {
          console.log("onCompletion");
        },
        onFinal(completion) {
          console.log("onFinal", completion);
        },
      }
    )
  );
}
