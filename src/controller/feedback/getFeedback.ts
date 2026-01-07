import { Request, Response } from "express";
import { conversationModel } from "../../model/conversationModel";
import { generateTranslateContents } from "../../lib/ai/genaiTranslate";
import { feedbackPrompt } from "../../lib/prompts/feedbackPrompt";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";

const getFeedback = async (req: Request, res: Response) => {
  try {
    // Extract original message and conversation ID from request
    const { originalMessage } = req.body;
    const id = req.query.chatId;

    // Find the conversation document in database
    const conversation = await conversationModel.findById(id);
    if (!conversation) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES?.CONVERSATION_NOT_FOUND,
      });
    }

    // Get the AI prompt template for feedback generation
    const systemInstruction = feedbackPrompt();

    // Generate feedback and correction using AI
    // Uses conversation content or fallback to original message from request
    const translatedText = await generateTranslateContents(
      conversation.content ?? originalMessage,
      systemInstruction
    );

    // Parse the AI response to extract corrected sentence and feedback
    // Expected format: "Corrected sentence:\n[corrected text]\n\nFeedback:\n[feedback text]"
    const correctedMatch = translatedText.match(
      /Corrected sentence:\s*(.*?)(?=\n\nFeedback:|$)/s
    );
    const feedbackMatch = translatedText.match(/Feedback:\s*(.*)/s);

    // Save parsed feedback and correction to database
    // Store corrected sentence in correction field
    if (correctedMatch && correctedMatch[1]) {
      conversation.correction = correctedMatch[1].trim();
    }
    // Store feedback explanation in feedback field
    if (feedbackMatch && feedbackMatch[1]) {
      conversation.feedback = feedbackMatch[1].trim();
    }
    // Persist changes to database
    await conversation.save();

    // Return successful response with parsed data
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.FEEDBACK_AND_CORRECTION_SUCCESS,
      data: { correctedMatch, feedbackMatch },
    });
  } catch (err) {
    // Log error for debugging purposes
    console.log(err);
    // Return internal server error response
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};
export default getFeedback;
