import { config } from "dotenv";
config();

// Function to Generate Content from Messages
export const generateTranslateContents = async (
  contents: string,
  systemInstruction: string
): Promise<string> => {
  // GenAI Client Setup
  const apiKey = process.env.GEMINI_API_KEY as string;

  if (!apiKey) {
    throw new Error("Missing API key for Google GenAI");
  }
  // Dynamically import to avoid build/runtime ESM issues
  const { GoogleGenAI } = await import("@google/genai");

  // GenAI Client Initialization
  const genaiClient = new GoogleGenAI({
    apiKey: apiKey,
  });

  const coonfig = {
    systemInstruction: systemInstruction,
    generationConfig: {
      temperature: 0,
      topP: 1,
      maxOutputTokens: 2048,
    },
  };

  const response = await genaiClient.models.generateContentStream({
    model: "gemini-2.5-flash",
    config: coonfig,
    contents: contents,
  });

  let fullText = "";
  for await (const chunk of response) {
    if (chunk.text) {
      fullText += chunk.text;
    }
  }

  return fullText;
};
