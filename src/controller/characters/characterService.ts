import { Request, Response } from "express";
import { User } from "../../model/userModel";
import {
  AIMsg,
  buildContents,
  generateFromContents,
  getLastConversations,
} from "../../lib/ai/genaiClient";
import { userInformationPrompt } from "../../lib/prompts/generatePrompt";
import { conversationModel } from "../../model/conversationModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { Character, characterModel } from "../../model/characterModel";
import { characterPrompt } from "../../lib/prompts/characterPrompt";

const characterService = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const id = req.query.id as string;
    const userDetails = req.user as User & { _id: string };

    const currentCharacter = (await characterModel.findById(
      id
    )) as Character & { _id: string };

    // Fetch Previous Conversations for this user & character
    const oldConversations = await getLastConversations(
      userDetails._id,
      "character",
      {
        characterName: currentCharacter.name,
      }
    );

    // Generate Basic Prompts with Character + User Information
    const systemInstruction = characterPrompt(currentCharacter, userDetails);

    // Clone incoming messages
    let allMessages = [...messages];

    // Append previous chats (enriching context)
    if (oldConversations) {
      allMessages.unshift(...oldConversations.reverse());
    }

    // Generate Detailed Reply
    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    // Find the real user message from the current request only (ignore system prompt)
    const incomingUserMessage = messages
      .slice()
      .reverse()
      .find((m: AIMsg) => m.role === "user");

    if (!incomingUserMessage) {
      return res.status(400).json({
        status: false,
        message: "No user message found in the request",
      });
    }

    // Save user message
    const userMsg = await conversationModel.create({
      role: "user",
      conversationMode: "character",
      content: incomingUserMessage.content,
      timestamp: new Date(),
      userId: userDetails._id,
      characterName: currentCharacter?.name,
      characterId: currentCharacter?._id,
    });

    // Save model message
    const modelMsg = await conversationModel.create({
      role: "model",
      conversationMode: "character",
      content: terseReply,
      timestamp: new Date(),
      userId: userDetails._id,
      characterName: currentCharacter?.name,
      characterId: currentCharacter?._id,
    });

    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.CHAT_RESPONSE,
      reply: modelMsg,
    });
  } catch (err) {
    console.log(ERROR_MESSAGES?.CHAT_RESPONSE_ERROR, err);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};
export default characterService;
