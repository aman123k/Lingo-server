import { Request, Response } from "express";
import { User } from "../../model/userModel";
import { conversationModel } from "../../model/conversationModel";
import mongoose from "mongoose";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";

const chatHistory = async (req: Request, res: Response) => {
  try {
    // Fetch conversations from database for the authenticated user
    const userDetails = req.user as User & { _id: string };

    // Pagination Logic
    const limit = 20;
    // 2. Convert the string ID into a MongoDB ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userDetails._id);

    // 3. Define the common filter object
    const queryFilter = {
      userId: userIdObjectId,
      conversationMode: "chat",
    };
    const total = await conversationModel.countDocuments(queryFilter);

    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Retrieve paginated messages
    const messages = await conversationModel
      .find({
        $and: [
          {
            userId: userDetails._id,
          },
          { conversationMode: "chat" },
        ],
      })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // If no conversations exist, initialize with a welcome message
    if (messages?.length <= 0 || !messages) {
      const initialBotMessage = new conversationModel({
        userId: userDetails._id,
        role: "model",
        conversationMode: "chat",
        content:
          "Hey! I'm Jennifer, your personal AI language teacher. Ask me anything ?🙂",
      });

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
