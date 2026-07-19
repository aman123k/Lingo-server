import { Request, Response } from "express";
import { User, userModel } from "../../model/userModel";
import {
  AIMsg,
  buildContents,
  generateFromContents,
  getLastConversations,
} from "../../lib/ai/genaiClient";
import { conversationModel } from "../../model/conversationModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { travelPrompt } from "../../lib/prompts/travelPrompt";
import { Travel, travelModel } from "../../model/travelModel";

const travelsService = async (req: Request, res: Response) => {
  try {
    const { messages, chatSessionId } = req.body as { messages: AIMsg[]; chatSessionId?: string };
    const travelId = req.query.travelId as string;
    const userDetails = req.user as User & { _id: string };

    // Fetch fresh user to check subscriptionPlan
    const freshUser = await userModel.findById(userDetails._id);
    if (!freshUser) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Free tier cannot access travels at all
    if (freshUser.subscriptionPlan === "free") {
      return res.status(403).json({
        status: false,
        isLimitReached: true,
        message: "Travel Survival requires a subscription. Please upgrade to continue.",
      });
    }

    // Gold tier is limited to 3 messages per day
    if (freshUser.subscriptionPlan === "gold") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayMsgCount = await conversationModel.countDocuments({
        userId: userDetails._id,
        conversationMode: "travel",
        role: "user",
        timestamp: { $gte: startOfDay },
      });

      if (todayMsgCount >= 3) {
        return res.status(403).json({
          status: false,
          isLimitReached: true,
          message: "Daily Gold limit of 3 messages reached for Travel Survival. Upgrade to Platinum for unlimited access.",
        });
      }
    }

    if (!travelId) {
      return res.status(400).json({
        status: false,
        message: "Travel ID is required",
      });
    }

    const oldConversations =
      (await getLastConversations(userDetails._id, "travel", {
        travelId,
        chatSessionId,
      })) || [];

    const currentTravel = (await travelModel.findById(
      travelId
    )) as Travel & { _id: string };

    const systemInstruction = travelPrompt(currentTravel, userDetails);

    const allMessages: any = [...oldConversations.reverse(), ...messages];

    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    const incomingUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!incomingUserMessage) {
      return res.status(400).json({
        status: false,
        message: "No user message found in the request",
      });
    }

    const userTimestamp = new Date();
    const modelTimestamp = new Date(userTimestamp.getTime() + 50);

    const [userMsg, modelMsg] = await Promise.all([
      conversationModel.create({
        role: "user",
        conversationMode: "travel",
        content: incomingUserMessage.content,
        timestamp: userTimestamp,
        userId: userDetails._id,
        travelId,
        scenario: currentTravel.name,
        chatSessionId,
      }),
      conversationModel.create({
        role: "model",
        conversationMode: "travel",
        content: terseReply,
        timestamp: modelTimestamp,
        userId: userDetails._id,
        travelId,
        scenario: currentTravel?.name,
        chatSessionId,
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

export default travelsService;
