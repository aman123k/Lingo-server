import { Request, Response } from "express";
import { User } from "../../model/userModel";
import { getLastConversations } from "../../lib/ai/genaiClient";
import { conversationModel } from "../../model/conversationModel";
import mongoose from "mongoose";

const chatHistory = async (req: Request, res: Response) => {
  try {
    // Fetch conversations from database for the authenticated user
    const userDetails = req.user as User & { _id: string };

    // Pagination Logic
    const limit = 10;
    // 2. Convert the string ID into a MongoDB ObjectId
    const userIdObjectId = new mongoose.Types.ObjectId(userDetails._id);

    // 3. Define the common filter object
    const queryFilter = {
      userId: userIdObjectId,
      conversationMode: "chat",
    };
    const total = await conversationModel.countDocuments(queryFilter);

    const page = parseInt(req.query.page as string) || 1;
    const skip = total - page * limit < 0 ? 0 : total - page * limit;

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
      .sort({ timestamp: -1 }) // important → oldest first
      .skip(skip)
      .limit(limit);

    // If no conversations exist, initialize with a welcome message
    if (messages?.length <= 0 || !messages) {
      const initialBotMessage = new conversationModel({
        userId: userDetails._id,
        role: "model",
        conversationMode: "chat",
        content:
          "Hey! I'm Jennifer, your personal AI language teacher. Ask me anything 🙂",
      });

      // Save the initial message to the database
      await initialBotMessage.save();
      return res.status(200).json({
        status: true,
        message: "Chat history initialized with a welcome message.",
        data: [initialBotMessage],
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Chat history retrieved successfully.",
        data: messages,
        total,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export default chatHistory;
