import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { characterModel } from "../../model/characterModel";

const allCharacters = async (req: Request, res: Response) => {
  try {
    // Fetch all characters from database
    const characters = await characterModel.find({});
    // Return success response with characters data
    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.CHARACTERS_RETRIEVED,
      data: characters,
      total: characters.length,
    });
  } catch (error) {
    console.log("Error fetching characters:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};

export default allCharacters;
