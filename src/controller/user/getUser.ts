import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User, userModel } from "../../model/userModel";
import client from "../../redis/redisClient";

const getUserInfo = async (req: Request, res: Response) => {
  try {
    // Extract authenticated user details from request
    const userDetails = req.user as User & { _id: string };

    // Check if user data exists in Redis cache
    const RedisUser = await client.get(userDetails?._id);

    // Return cached user data if available
    if (RedisUser) {
      return res.status(200).json({
        status: true,
        message: SUCCESS_MESSAGES.USER_RETRIEVED,
        data: JSON.parse(RedisUser),
      });
    }

    // Query database for user and exclude sensitive fields
    const user = await userModel
      .findOne({ email: userDetails?.email })
      .select("-loginWith -password");

    // Return error if user not found in database
    if (!user) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_UNKNOWN_ERROR,
      });
    }

    // Cache user data in Redis with 24-hour expiration (86400 seconds)
    await client.set(userDetails?._id, JSON.stringify(user), { EX: 86400 });

    // Return user profile data
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.USER_RETRIEVED,
      data: user,
    });
  } catch (err) {
    // Log error details for debugging
    console.log(ERROR_MESSAGES.USER_UNKNOWN_ERROR, err);

    // Return generic server error response
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.USER_UNKNOWN_ERROR,
    });
  }
};

export default getUserInfo;
