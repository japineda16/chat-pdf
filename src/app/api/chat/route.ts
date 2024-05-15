import { ModelFusionTextStream, asChatMessages } from "@modelfusion/vercel-ai";
import { Message, StreamingTextResponse } from "ai";
import {
  MemoryVectorIndex,
  VectorIndexRetriever,
  generateText,
  ollama,
  retrieve,
  splitAtCharacter,
  splitTextChunks,
  streamText,
  upsertIntoVectorIndex,
} from "modelfusion";
import fs from "fs/promises";
import * as PdfJs from "pdfjs-dist";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const pages = await loadPdfPages(
      "/Users/japineda/projects/ai/chat-pdf/public/data/constitucion.pdf"
    );

    const embeddingModel = ollama.TextEmbedder({
      model: "llama3",
    });

    const chunks = await splitTextChunks(
      splitAtCharacter({ maxCharactersPerChunk: 1000 }),
      pages
    );

    const vectorIndex = new MemoryVectorIndex<{
      pageNumber: number;
      text: string;
    }>();

    await upsertIntoVectorIndex({
      vectorIndex,
      embeddingModel,
      objects: chunks,
      getValueToEmbed: (chunk) => chunk.text,
    });

    const hypotheticalAnswer = await generateText({
      // use cheaper model to generate hypothetical answer:
      model: ollama
        .ChatTextGenerator({ model: "llama3", temperature: 0 })
        .withInstructionPrompt(),
      prompt: {
        system:
          "Responde la instruccion solicitada con cuidado, si desconoces la respuesta, responde con un mensaje de disculpas", // optional
        instruction: messages[messages.length - 1].content,
      },
    });

    // search for text chunks that are similar to the hypothetical answer:
    const information = await retrieve(
      new VectorIndexRetriever({
        vectorIndex,
        embeddingModel,
        maxResults: 5,
        similarityThreshold: 0.75,
      }),
      hypotheticalAnswer
    );

    // Use ModelFusion to call Ollama:
    const textStream = await streamText({
      model: ollama
        .ChatTextGenerator({ model: "llama3", temperature: 0.3 })
        .withChatPrompt(),
      prompt: {
        system:
          "Eres un asistente de inteligencia artificial de habla hispana llamado Jarvis" +
          "entrega la respuesta en formato de markdown y sigue las instrucciones del usuario cuidadosamente." +
          "Si no sabes la respuesta, responde con un mensaje de disculpas." +
          `busca informacion de relevancia dentro de este chunk: ${JSON.stringify(
            information
          )}`,

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
  } catch (error) {
    console.error(error);
  }
}

async function loadPdfPages(path: string) {
  const pdfData = await fs.readFile(path);

  const pdf = await PdfJs.getDocument({
    data: new Uint8Array(
      pdfData.buffer,
      pdfData.byteOffset,
      pdfData.byteLength
    ),
    useSystemFonts: true,
  }).promise;

  const pageTexts: Array<{
    pageNumber: number;
    text: string;
  }> = [];

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const pageContent = await page.getTextContent();

    pageTexts.push({
      pageNumber: i + 1,
      text: pageContent.items
        .filter((item) => (item as any).str != null)
        .map((item) => (item as any).str as string)
        .join(" ")
        .replace(/\s+/g, " "),
    });
  }

  return pageTexts;
}
