import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User, userModel } from "../../model/userModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { createToken } from "../../token/jwtToken";
import setAuthCookie from "../../lib/storeCookie";
import client from "../../redis/redisClient";

const updateUser = async (req: Request, res: Response) => {
  try {
    // Extract user responses from request body
    const {
      name,
      email,
      title,
      updatePass,
      translationLanguage,
      languageLevel,
      learningStyle,
    } = req.body;

    // Extract authenticated user details from request
    const userDetails = req.user as User & { _id: string };
    const hashPassword = updatePass ? await bcrypt.hash(updatePass, 10) : false;

    // ---------------- PROFILE UPDATE ----------------
    if (title === "Profile") {
      const updateUser = await userModel.findByIdAndUpdate(
        userDetails?._id,
        {
          name,
          email,
          ...(hashPassword && { password: hashPassword }),
          ...(hashPassword && { loginWith: "PASSWORD" }),
        },
        { new: true }
      );

      // Generate JWT token for authenticated user
      const userToken = updateUser && createToken(updateUser.toObject());

      // Set authentication cookie in response
      setAuthCookie(res, userToken ?? "");

      // Cache user data in Redis with 24-hour expiration (86400 seconds)
      await client.set(userDetails?._id, JSON.stringify(updateUser), {
        EX: 86400,
      });
    }
    // ---------------- PREFERENCES UPDATE ----------------
    else {
      const updateUser = await userModel.findByIdAndUpdate(
        userDetails?._id,
        {
          translationLanguage,
          languageLevel,
          learningStyle,
        },
        { new: true }
      );

      // Generate JWT token for authenticated user
      const userToken = updateUser && createToken(updateUser.toObject());

      // Set authentication cookie in response
      setAuthCookie(res, userToken ?? "");

      // Cache user data in Redis with 24-hour expiration (86400 seconds)
      await client.set(userDetails?._id, JSON.stringify(updateUser), {
        EX: 86400,
      });
    }
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES?.PROFILE_UPDATE,
    });
  } catch (error) {
    // Log error for debugging and monitoring
    console.error(ERROR_MESSAGES.UPDATE_USER_ERROR, error);

    // Return generic internal server error response
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default updateUser;
