import { Request, Response } from "express";
import { User } from "../../model/userModel";
import {
  conversationModel,
  ConversationMode,
} from "../../model/conversationModel";
import mongoose from "mongoose";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { WELCOME_TEMPLATES } from "../../lib/templates/welcomeTemplate";

const chatHistory = async (req: Request, res: Response) => {
  try {
    const userDetails = req.user as User & { _id: string };
    const query = req.query;

    // Allowed conversation modes
    const validModes: ConversationMode[] = [
      "chat",
      "character",
      "roleplay",
      "debate",
    ];

    const conversationMode: ConversationMode = validModes.includes(
      (query.mode as ConversationMode) || ""
    )
      ? (query.mode as ConversationMode)
      : "chat";

    // Pagination
    const limit = parseInt(query.limit as string) || 20;
    const page = parseInt(query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Helper to safely convert string to ObjectId
    const toObjectId = (id?: string) => {
      try {
        return id ? new mongoose.Types.ObjectId(id) : undefined;
      } catch {
        return undefined;
      }
    };

    // Build dynamic filter
    const filter: any = {
      userId: new mongoose.Types.ObjectId(userDetails._id),
      conversationMode,
    };

    const optionalFields = [
      "characterId",
      "debateId",
      "topic",
      "characterName",
      "roleName",
      "scenario",
      "position",
    ] as const;

    optionalFields.forEach((field) => {
      if (query[field]) {
        if (field === "characterId" || field === "debateId") {
          const idObj = toObjectId(query[field] as string);
          if (idObj) filter[field] = idObj;
        } else {
          filter[field] = query[field];
        }
      }
    });

    // Count total messages
    const total = await conversationModel.countDocuments(filter);

    // Get messages
    let messages = await conversationModel
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Initialize with welcome message if empty
    if (!messages || messages.length === 0) {
      const initialMessageData: any = {
        userId: userDetails._id,
        role: "model",
        conversationMode,
        content: WELCOME_TEMPLATES[conversationMode](query),
      };
      console.log(WELCOME_TEMPLATES[conversationMode](query));
      // Add optional fields dynamically
      optionalFields.forEach((field) => {
        if (query[field]) initialMessageData[field] = query[field];
      });

      const initialMessage = new conversationModel(initialMessageData);
      await initialMessage.save();

      return res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES.INITIALBOTMESSAGE,
        data: [initialMessage],
      });
    }
    // Return messages (oldest first)
    messages = messages.reverse();

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.OLDER_MESSAGE,
      data: messages,
      total,
    });
  } catch (error) {
    console.log(ERROR_MESSAGES?.CHAT_HISTORY_ERROR, error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};

export default chatHistory;
