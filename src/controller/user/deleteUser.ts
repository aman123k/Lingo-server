import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User, userModel } from "../../model/userModel";
import { conversationModel } from "../../model/conversationModel";
import { clearAuthCookie } from "../../lib/storeCookie";
import client from "../../redis/redisClient";

const deleteUser = async (req: Request, res: Response) => {
  try {
    // Extract authenticated user details from request (added by auth middleware)
    const userDetails = req.user as User & { _id: string };

    // Delete user account and all related conversations in parallel
    const [deletedUser] = await Promise.all([
      userModel.findByIdAndDelete(userDetails._id), // Remove user from database
      conversationModel.deleteMany({ userId: userDetails._id }), // Remove user's conversations
    ]);

    // If user does not exist, return not found response
    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
    // delete authentication cookie from response
    clearAuthCookie(res);
    await client.set(userDetails?._id, "");

    // Return success response after successful deletion
    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.DELETE_USER,
      route: "/login",
    });
  } catch (error) {
    // Log error for debugging and monitoring
    console.error(ERROR_MESSAGES.DELETE_USER_ERROR, error);

    // Return generic internal server error response
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default deleteUser;
