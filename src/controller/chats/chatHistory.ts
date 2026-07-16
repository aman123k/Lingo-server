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
      "business",
      "vocab",
      "story",
    ];

    // Handle array case if mode parameter is passed twice
    let modeParam = query.mode;
    if (Array.isArray(modeParam)) {
      modeParam = modeParam[0];
    }

    const conversationMode: ConversationMode = validModes.includes(
      (modeParam as ConversationMode) || ""
    )
      ? (modeParam as ConversationMode)
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

    // Resolve or find the active chat session ID
    let chatSessionId = query.sessionId as string;
    
    // Match optional fields to check scoped sessions
    const sessionMatchFilter: any = {
      userId: new mongoose.Types.ObjectId(userDetails._id),
      conversationMode,
    };
    if (query.characterId) {
      const idObj = toObjectId(query.characterId as string);
      if (idObj) sessionMatchFilter.characterId = idObj;
    }
    if (query.debateId) {
      const idObj = toObjectId(query.debateId as string);
      if (idObj) sessionMatchFilter.debateId = idObj;
    }
    if (query.roleplayId) {
      const idObj = toObjectId(query.roleplayId as string);
      if (idObj) sessionMatchFilter.roleplayId = idObj;
    }

    if (!chatSessionId || chatSessionId === "undefined" || chatSessionId === "null") {
      const latestMsg = await conversationModel
        .findOne(sessionMatchFilter)
        .sort({ timestamp: -1 });
      chatSessionId = latestMsg?.chatSessionId || new mongoose.Types.ObjectId().toString();
    }

    // Build dynamic filter with session ID
    const filter: any = {
      userId: new mongoose.Types.ObjectId(userDetails._id),
      conversationMode,
    };

    if (chatSessionId === "default") {
      filter.$or = [
        { chatSessionId: "default" },
        { chatSessionId: { $exists: false } },
        { chatSessionId: null },
        { chatSessionId: "" }
      ];
    } else {
      filter.chatSessionId = chatSessionId;
    }

    const optionalFields = [
      "characterId",
      "characterName",
      "debateId",
      "topic",
      "scenario",
      "roleplayId",
    ] as const;

    optionalFields.forEach((field) => {
      if (query[field]) {
        if (
          field === "characterId" ||
          field === "debateId" ||
          field === "roleplayId"
        ) {
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
        chatSessionId,
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
        chatSessionId,
      });
    }
    // Return messages (oldest first)
    messages = messages.reverse();

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.OLDER_MESSAGE,
      data: messages,
      total,
      chatSessionId,
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
