import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User, userModel } from "../../model/userModel";

const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userDetails = req.user as User & { _id: string };

    // Exclude sensitive loginWith,password field from response
    const user = await userModel
      .findOne({ email: userDetails?.email })
      .select("-loginWith -password");

    // Handle case where user exists in token but not in database
    // This could happen if user was deleted after token was issued
    if (!user) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_UNKNOWN_ERROR,
      });
    }

    // Successfully authenticated - return user profile data
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.USER_RETRIEVED,
      data: user,
    });
  } catch (err) {
    // Log error for debugging purposes
    console.log(ERROR_MESSAGES.USER_UNKNOWN_ERROR, err);

    // Return generic server error to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.USER_UNKNOWN_ERROR,
    });
  }
};

export default getUserInfo;
