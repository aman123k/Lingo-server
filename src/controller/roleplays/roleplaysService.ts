import { Request, Response } from "express";
import { User } from "../../model/userModel";
import {
  AIMsg,
  buildContents,
  generateFromContents,
  getLastConversations,
} from "../../lib/ai/genaiClient";
import { conversationModel } from "../../model/conversationModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import roleplayPrompt from "../../lib/prompts/roleplayPrompt";
import { Roleplay, roleplayModel } from "../../model/roleplayModel";

const roleplayService = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: AIMsg[] };
    const roleplayId = req.query.roleplayId as string;
    const userDetails = req.user as User & { _id: string };

    // Validate inputs
    if (!roleplayId) {
      return res.status(400).json({
        status: false,
        message: "Roleplay ID is required",
      });
    }

    // Fetch previous conversations for this user & debate
    const oldConversations =
      (await getLastConversations(userDetails._id, "roleplay", {
        roleplayId,
      })) || [];

    // Fetch character
    const currentRoleplay = (await roleplayModel.findById(
      roleplayId
    )) as Roleplay & { _id: string };

    // Build system instruction (roleplay-specific)
    const systemInstruction = roleplayPrompt(currentRoleplay, userDetails);

    // Combine previous and new messages
    const allMessages: any = [...oldConversations.reverse(), ...messages];

    // Generate AI reply
    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    // Extract latest user message from current request
    const incomingUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!incomingUserMessage) {
      return res.status(400).json({
        status: false,
        message: "No user message found in the request",
      });
    }

    // Use slightly different timestamps for user and model messages
    const userTimestamp = new Date();
    const modelTimestamp = new Date(userTimestamp.getTime() + 50); // 50ms later

    // Save user and model messages in parallel with distinct timestamps
    const [userMsg, modelMsg] = await Promise.all([
      conversationModel.create({
        role: "user",
        conversationMode: "roleplay",
        content: incomingUserMessage.content,
        timestamp: userTimestamp,
        userId: userDetails._id,
        roleplayId,
        scenario: currentRoleplay.name,
      }),
      conversationModel.create({
        role: "model",
        conversationMode: "roleplay",
        content: terseReply,
        timestamp: modelTimestamp,
        userId: userDetails._id,
        roleplayId,
        scenario: currentRoleplay?.name,
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

export default roleplayService;
