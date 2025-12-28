import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { roleplayModel } from "../../model/roleplayModel";

const allRoleplays = async (req: Request, res: Response) => {
  try {
    // Fetch all roleplays from database
    const roleplays = await roleplayModel.find({});

    // Return success response with roleplays data
    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.ROLEPLAYS_RETRIEVED,
      data: roleplays,
      total: roleplays.length,
    });
  } catch (error) {
    console.log("Error fetching roleplays:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};

export default allRoleplays;
