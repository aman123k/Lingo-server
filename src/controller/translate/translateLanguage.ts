/**
 * Handles translation of an existing conversation message.
 *
 * Flow:
 * 1. Extract conversation ID from the request body.
 * 2. Fetch the conversation using the ID.
 * 3. Generate system instructions using translationPrompt (translation-only rules).
 * 4. Use generateTranslateContents to translate the existing message.
 * 5. Save the translated result into conversation.translatedContent.
 * 6. Return translated text back to the client.
 *
 * Notes:
 * - Ensures the conversation exists before translation.
 * - Requires translationLanguage in user details.
 */

import { Request, Response } from "express";
import { User } from "../../model/userModel";
import { conversationModel } from "../../model/conversationModel";
import { translationPrompt } from "../../lib/prompts/generateTranslate";
import { generateTranslateContents } from "../../lib/ai/genaiTranslate";

const translateLanguage = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const userDetails = req.user as User & { _id: string };
    const conversation = await conversationModel.findById(id);

    if (!conversation) {
      return res.status(404).json({
        status: false,
        message: "Conversation not found",
      });
    }

    // System instruction for translation only
    const systemInstruction = translationPrompt(userDetails);

    // Generate translation
    const translatedText = await generateTranslateContents(
      conversation.content ?? "",
      systemInstruction
    );

    // Save translated message into DB
    conversation.translatedContent = translatedText;
    await conversation.save();

    res.status(200).json({
      status: true,
      message: "Translation successful",
      data: translatedText,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export default translateLanguage;
