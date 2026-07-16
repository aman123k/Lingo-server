import { Request, Response } from "express";
import { User } from "../../model/userModel";
import {
  AIMsg,
  buildContents,
  generateFromContents,
  getLastConversations,
} from "../../lib/ai/genaiClient";
import { conversationModel, ConversationMode } from "../../model/conversationModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { businessPrompt } from "../../lib/prompts/businessPrompt";
import { vocabPrompt } from "../../lib/prompts/vocabPrompt";
import { storyPrompt } from "../../lib/prompts/storyPrompt";

const learningModeService = async (req: Request, res: Response) => {
  try {
    const { messages, chatSessionId } = req.body as { messages: AIMsg[]; chatSessionId?: string };
    const mode = req.query.mode as ConversationMode;
    const userDetails = req.user as User & { _id: string };

    if (!mode || !["business", "vocab", "story"].includes(mode)) {
      return res.status(400).json({
        status: false,
        message: "Valid mode parameter is required",
      });
    }

    // Fetch previous conversations
    const oldConversations =
      (await getLastConversations(userDetails._id, mode, { chatSessionId })) || [];

    // Build system instruction based on mode
    let systemInstruction = "";
    if (mode === "business") {
      systemInstruction = businessPrompt(userDetails);
    } else if (mode === "vocab") {
      systemInstruction = vocabPrompt(userDetails);
    } else if (mode === "story") {
      systemInstruction = storyPrompt(userDetails);
    }

    // Combine old and new messages
    const allMessages: any = [...oldConversations.reverse(), ...messages];

    // Generate AI reply
    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    // Extract latest user message
    const incomingUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!incomingUserMessage) {
      return res.status(400).json({
        status: false,
        message: "No user message found in the request",
      });
    }

    const userTimestamp = new Date();
    const modelTimestamp = new Date(userTimestamp.getTime() + 50);

    const [userMsg, modelMsg] = await Promise.all([
      conversationModel.create({
        role: "user",
        conversationMode: mode,
        content: incomingUserMessage.content,
        timestamp: userTimestamp,
        userId: userDetails._id,
        chatSessionId,
      }),
      conversationModel.create({
        role: "model",
        conversationMode: mode,
        content: terseReply,
        timestamp: modelTimestamp,
        userId: userDetails._id,
        chatSessionId,
      }),
    ]);

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.CHAT_RESPONSE,
      reply: modelMsg,
    });
  } catch (err) {
    console.error(ERROR_MESSAGES.CHAT_RESPONSE_ERROR, err);
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default learningModeService;
