import { Request, Response } from "express";
import { User } from "../../model/userModel";
import {
  AIMsg,
  buildContents,
  generateFromContents,
  getLastConversations,
} from "../../lib/ai/genaiClient";
import { conversationModel } from "../../model/conversationModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { Character, characterModel } from "../../model/characterModel";
import { characterPrompt } from "../../lib/prompts/characterPrompt";

const characterService = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const characterId = req.query.characterId as string;
    const userDetails = req.user as User & { _id: string };

    // Validate inputs
    if (!characterId) {
      return res.status(400).json({
        status: false,
        message: "Character ID is required",
      });
    }

    // Fetch character
    const currentCharacter = (await characterModel.findById(
      characterId
    )) as Character & { _id: string };

    if (!currentCharacter) {
      return res.status(404).json({
        status: false,
        message: "Character not found",
      });
    }

    // Fetch previous conversations for this user & character
    const oldConversations =
      (await getLastConversations(userDetails._id, "character", {
        characterName: currentCharacter.name,
      })) || [];

    // Generate Basic Prompts with Character + User Information
    const systemInstruction = characterPrompt(currentCharacter, userDetails);

    // Combine previous and new messages
    const allMessages = [...oldConversations.reverse(), ...messages];

    // Generate Detailed Reply
    const terseContents = buildContents(allMessages);
    const terseReply = await generateFromContents(
      terseContents,
      systemInstruction
    );

    // Extract latest user message from current request
    const incomingUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!incomingUserMessage) {
      return res.status(400).json({
        status: false,
        message: "No user message found in the request",
      });
    }

    // Use slightly different timestamps for user and model messages
    const userTimestamp = new Date();
    const modelTimestamp = new Date(userTimestamp.getTime() + 50); // 50ms later

    // Save user and model messages in parallel
    const [userMsg, modelMsg] = await Promise.all([
      conversationModel.create({
        role: "user",
        conversationMode: "character",
        content: incomingUserMessage.content,
        timestamp: userTimestamp,
        userId: userDetails._id,
        characterName: currentCharacter.name,
        characterId: currentCharacter._id,
      }),
      conversationModel.create({
        role: "model",
        conversationMode: "character",
        content: terseReply,
        timestamp: modelTimestamp,
        userId: userDetails._id,
        characterName: currentCharacter.name,
        characterId: currentCharacter._id,
      }),
    ]);

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
