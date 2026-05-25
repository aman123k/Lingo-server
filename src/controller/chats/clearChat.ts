import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User } from "../../model/userModel";
import { conversationModel, ConversationMode } from "../../model/conversationModel";
import mongoose from "mongoose";

const clearChat = async (req: Request, res: Response) => {
  try {
    const userDetails = req.user as User & { _id: string };
    const query = req.query;

    // Handle array case if mode parameter is passed twice
    let modeParam = query.mode;
    if (Array.isArray(modeParam)) {
      modeParam = modeParam[0];
    }

    const validModes: ConversationMode[] = ["chat", "character", "roleplay", "debate"];
    const conversationMode: ConversationMode = validModes.includes(
      (modeParam as ConversationMode) || ""
    )
      ? (modeParam as ConversationMode)
      : "chat";

    const filter: any = {
      userId: new mongoose.Types.ObjectId(userDetails._id),
      conversationMode,
    };

    if (query.sessionId) {
      if (query.sessionId === "default") {
        filter.$or = [
          { chatSessionId: "default" },
          { chatSessionId: { $exists: false } },
          { chatSessionId: null },
          { chatSessionId: "" }
        ];
      } else {
        filter.chatSessionId = query.sessionId as string;
      }
    }

    // Helper to safely convert string to ObjectId
    const toObjectId = (id?: string) => {
      try {
        return id ? new mongoose.Types.ObjectId(id) : undefined;
      } catch {
        return undefined;
      }
    };

    // Match query criteria exactly like chatHistory.ts
    const optionalFields = ["characterId", "characterName", "debateId", "topic", "scenario", "roleplayId"] as const;

    optionalFields.forEach((field) => {
      if (query[field]) {
        if (field === "characterId" || field === "debateId" || field === "roleplayId") {
          const idObj = toObjectId(query[field] as string);
          if (idObj) filter[field] = idObj;
        } else {
          filter[field] = query[field];
        }
      }
    });

    // Delete all messages matching the session filter
    await conversationModel.deleteMany(filter);

    return res.status(200).json({
      status: true,
      message: "Chat history cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default clearChat;
