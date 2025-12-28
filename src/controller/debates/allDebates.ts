import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { debateModel } from "../../model/debateModel";

const allDebates = async (req: Request, res: Response) => {
  try {
    // Fetch all debates from database
    const debates = await debateModel.find({}).sort({ createdAt: -1 });

    // Return success response with debates data
    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.DEBATES_RETRIEVED,
      data: debates,
      total: debates.length,
    });
  } catch (error) {
    console.log("Error fetching debates:", error);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};

export default allDebates;
