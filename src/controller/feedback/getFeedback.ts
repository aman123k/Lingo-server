import { Request, Response } from "express";
import { conversationModel } from "../../model/conversationModel";
import { User } from "../../model/userModel";
import { generateTranslateContents } from "../../lib/ai/genaiTranslate";
import { feedbackPrompt } from "../../lib/prompts/feedbackPrompt";

const getFeedback = async (req: Request, res: Response) => {
  try {
    const { originalMessage } = req.body;
    const id = req.query.chatId;

    const conversation = await conversationModel.findById(id);
    if (!conversation) {
      return res.status(404).json({
        status: false,
        message: "Conversation not found",
      });
    }

    // System instruction for translation only
    const systemInstruction = feedbackPrompt();

    // Generate translation
    const translatedText = await generateTranslateContents(
      conversation.content ?? originalMessage,
      systemInstruction
    );

    // Parse feedback and correction from the response
    const correctedMatch = translatedText.match(
      /Corrected sentence:\s*(.*?)(?=\n\nFeedback:|$)/s
    );
    const feedbackMatch = translatedText.match(/Feedback:\s*(.*)/s);

    // Save translated message into DB
    if (correctedMatch && correctedMatch[1]) {
      conversation.correction = correctedMatch[1].trim();
    }
    if (feedbackMatch && feedbackMatch[1]) {
      conversation.feedback = feedbackMatch[1].trim();
    }
    await conversation.save();

    res.status(200).json({
      status: true,
      message: "Translation successful",
      data: { correctedMatch, feedbackMatch },
    });
  } catch (err) {
    console.log(err);
  }
};
export default getFeedback;
