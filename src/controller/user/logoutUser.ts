import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User } from "../../model/userModel";
import { clearAuthCookie } from "../../lib/storeCookie";
import client from "../../redis/redisClient";

const logoutUser = async (req: Request, res: Response) => {
  try {
    // Extract authenticated user details from request
    const userDetails = req.user as User & { _id: string };

    // delete authentication cookie from response
    clearAuthCookie(res);
    await client.set(userDetails?._id, "");
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.LOGGED_OUT,
      route: "/login",
    });
  } catch (err) {
    // Log error for debugging and monitoring
    console.log(ERROR_MESSAGES.LOGOUT_ERROR, err);

    // Return generic server error to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES?.INTERNAL_SERVER_ERROR,
    });
  }
};
export default logoutUser;
