import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { travelModel } from "../../model/travelModel";

const allTravels = async (req: Request, res: Response) => {
  try {
    const travels = await travelModel.find({});

    return res.status(200).json({
      status: true,
      message: "Travel scenarios retrieved successfully",
      data: travels,
      total: travels.length,
    });
  } catch (error) {
    console.error("Error fetching travel scenarios:", error);
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default allTravels;
