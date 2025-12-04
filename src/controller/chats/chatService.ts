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

const chatService = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const userDetails = req.user as User & { _id: string };

    // Fetch Previous Conversations
    const oldConversations = await getLastConversations(
      userDetails._id,
      "chat"
    );

    // Generate Basic Prompts with User Information
    const systemInstruction = userInformationPrompt(userDetails);

    // Clone incoming messages
    let allMessages = [...messages];

    // Append previous chats (enriching context)
    if (oldConversations) {
      allMessages.unshift(...oldConversations.reverse());
    }

    // Generate Detailed Reply
    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    // Find the real user message from the current request only (ignore system prompt)
    const incomingUserMessage = messages
      .slice()
      .reverse()
      .find((m: AIMsg) => m.role === "user");

    if (!incomingUserMessage) {
      return res.status(400).json({
        status: false,
        message: "No user message found in the request",
      });
    }

    // Save user message
    const userMsg = await conversationModel.create({
      role: "user",
      conversationMode: "chat",
      content: incomingUserMessage.content,
      timestamp: new Date(),
      userId: userDetails._id,
    });

    // Save model message
    const modelMsg = await conversationModel.create({
      role: "model",
      conversationMode: "chat",
      content: terseReply,
      timestamp: new Date(),
      userId: userDetails._id,
    });

    res.status(200).json({
      status: true,
      message: "Chat response generated successfully",
      reply: modelMsg,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
export default chatService;
