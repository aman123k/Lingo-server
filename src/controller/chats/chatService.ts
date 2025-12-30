import mongoose from "mongoose";
import { Request, Response } from "express";
import { User } from "../../model/userModel";
import {
  AIMsg,
  buildContents,
  generateFromContents,
  getLastConversations,
} from "../../lib/ai/genaiClient";
import { userInformationPrompt } from "../../lib/prompts/generatePrompt";
import { conversationModel } from "../../model/conversationModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";

const chatService = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const userDetails = req.user as User & { _id: string };

    // Fetch Previous Conversations
    const oldConversations =
      (await getLastConversations(userDetails._id, "chat")) || [];

    // Generate Basic Prompts with User Information
    const systemInstruction = userInformationPrompt(userDetails);

    // Combine old and new messages
    const allMessages = [...oldConversations.reverse(), ...messages];

    // Generate Detailed Reply
    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    // Extract the latest user message from current request
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

    // Save both messages in parallel
    const [userMsg, modelMsg] = await Promise.all([
      conversationModel.create({
        role: "user",
        conversationMode: "chat",
        content: incomingUserMessage.content,
        timestamp: userTimestamp,
        userId: userDetails._id,
      }),
      conversationModel.create({
        role: "model",
        conversationMode: "chat",
        content: terseReply,
        timestamp: modelTimestamp,
        userId: userDetails._id,
      }),
    ]);

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.CHAT_RESPONSE,
      reply: modelMsg,
    });
  } catch (err) {
    console.log(ERROR_MESSAGES?.CHAT_RESPONSE_ERROR, err);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};
export default chatService;
