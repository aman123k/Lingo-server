import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/messages";
import { User } from "../../model/userModel";
import { conversationModel, ConversationMode } from "../../model/conversationModel";
import mongoose from "mongoose";

const getChatSessions = async (req: Request, res: Response) => {
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

    // Helper to safely convert string to ObjectId
    const toObjectId = (id?: string) => {
      try {
        return id ? new mongoose.Types.ObjectId(id) : undefined;
      } catch {
        return undefined;
      }
    };

    // Add mode-specific filters so history list is scoped correctly
    const optionalFields = ["characterId", "debateId", "roleplayId"] as const;
    optionalFields.forEach((field) => {
      if (query[field]) {
        const idObj = toObjectId(query[field] as string);
        if (idObj) filter[field] = idObj;
      }
    });

    // Group messages by chatSessionId
    const sessions = await conversationModel.aggregate([
      { $match: filter },
      // Sort messages ascending first so we can pick the first message for preview
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: "$chatSessionId",
          firstMessage: { $first: "$content" },
          latestTimestamp: { $last: "$timestamp" },
          characterName: { $first: "$characterName" },
          topic: { $first: "$topic" },
          scenario: { $first: "$scenario" },
        },
      },
      // Sort sessions descending by latest activity
      { $sort: { latestTimestamp: -1 } },
    ]);

    // Handle session display titles
    const sessionList = sessions.map((s) => {
      let title = s.firstMessage || "New Conversation";
      // Limit title size
      if (title.length > 40) {
        title = title.substring(0, 38) + "...";
      }

      return {
        sessionId: s._id || "default",
        title,
        latestTimestamp: s.latestTimestamp,
        characterName: s.characterName,
        topic: s.topic,
        scenario: s.scenario,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Chat sessions retrieved successfully",
      data: sessionList,
    });
  } catch (error) {
    console.error("Error retrieving chat sessions:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default getChatSessions;
