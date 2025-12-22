import { config } from "dotenv";
import { ThinkingConfig } from "@google/genai";
import { conversationModel } from "../../model/conversationModel";
config();

// AI Message Role and Message Type Definitions
export type AIMsgRole = "user" | "model";
export type AIMsg = { role: AIMsgRole; content: string };

// Getting last 50 conversation messages, with optional extra filters (e.g. character, topic)
export const getLastConversations = async (
  userId: string,
  mode: string,
  extraFilter: Record<string, unknown> = {}
) => {
  const baseFilter = {
    userId,
    conversationMode: mode,
  };

  const conversations = await conversationModel
    .find({ ...extraFilter, ...baseFilter })
    .sort({ timestamp: -1 })
    .limit(50)
    .lean();
  // console.log("Conversations:", conversations);
  return conversations;
};

// Function to Build Contents for GenAI Client
export const buildContents = (messages: AIMsg[]) => {
  return messages
    .filter((m) => typeof m?.content === "string" && m.content.length > 0)
    .map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));
};

// Function to Generate Content from Messages
export const generateFromContents = async (
  contents: ReturnType<typeof buildContents>,
  systemInstruction: string
): Promise<string> => {
  // GenAI Client Setup
  const apiKey = process.env.GEMINI_API_KEY as string;
  const thingkingConfig: ThinkingConfig = { thinkingBudget: -1 };

  // Tools Configuration
  const tools = [
    {
      googleSearch: {},
    },
  ];

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
    thinkingConfig: thingkingConfig,
    tools,
    systemInstruction: systemInstruction,
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
