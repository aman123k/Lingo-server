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
    // Fetch conversations from database for the authenticated user
    const userDetails = req.user as User & { _id: string };

    const {
      mode = "chat",
      characterName,
      roleName,
      scenario,
      topic,
      position,
    } = req.query;

    const characterId = req.query.id as string;

    // Validate and cast mode to ConversationMode
    const validModes: ConversationMode[] = [
      "chat",
      "character",
      "roleplay",
      "debate",
    ];
    const conversationMode: ConversationMode = validModes.includes(
      mode as ConversationMode
    )
      ? (mode as ConversationMode)
      : "chat";

    // Pagination Logic
    const limit = 20;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;
    // 2. Convert the string ID into a MongoDB ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userDetails._id);

    // 3. Define the common filter object
    const queryFilter: any = {
      userId: userIdObjectId,
      conversationMode: conversationMode,
    };

    // Add optional filters dynamically
    if (characterId)
      queryFilter.characterId = new mongoose.Types.ObjectId(characterId);

    if (roleName) queryFilter.roleName = roleName;
    if (scenario) queryFilter.scenario = scenario;
    if (topic) queryFilter.topic = topic;
    if (position) queryFilter.position = position;

    const total = await conversationModel.countDocuments(queryFilter);

    // 1. Get the dynamic content from our template map
    const dynamicContent = WELCOME_TEMPLATES[conversationMode](req.query);

    // Retrieve paginated messages
    const messages = await conversationModel
      .find(queryFilter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // If no conversations exist, initialize with a welcome message
    if (messages?.length <= 0 || !messages) {
      // Build initial message with mode-specific fields
      const initialBotMessageData: any = {
        userId: userDetails._id,
        role: "model",
        conversationMode: conversationMode,
        content: dynamicContent,
      };

      // Add mode-specific fields to initial message if filters are provided
      if (characterName) initialBotMessageData.characterName = characterName;
      if (characterId) initialBotMessageData.characterId = characterId;
      if (roleName) initialBotMessageData.roleName = roleName;
      if (scenario) initialBotMessageData.scenario = scenario;
      if (topic) initialBotMessageData.topic = topic;
      if (position) initialBotMessageData.position = position;

      const initialBotMessage = new conversationModel(initialBotMessageData);

      // Save the initial message to the database
      await initialBotMessage.save();
      return res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES?.INITIALBOTMESSAGE,
        data: [initialBotMessage],
      });
    } else {
      return res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES?.OLDER_MESSAGE,
        data: messages.reverse(),
        total,
      });
    }
  } catch (error) {
    console.log(ERROR_MESSAGES?.CHAT_HISTORY_ERROR, error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};

export default chatHistory;
