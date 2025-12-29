import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { User, userModel } from "../../model/userModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { createToken } from "../../token/jwtToken";
import setAuthCookie from "../../lib/storeCookie";
import client from "../../redis/redisClient";
import { conversationModel } from "../../model/conversationModel";

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

    let updatePayload: Partial<User> = {};

    /* ---------------- PROFILE UPDATE ---------------- */
    if (title === "Profile") {
      if (name) updatePayload.name = name;
      if (email) updatePayload.email = email;

      if (updatePass) {
        const hashedPassword = await bcrypt.hash(updatePass, 10);
        updatePayload.password = hashedPassword;
        updatePayload.loginWith = "PASSWORD";
      }
    } else {
      /* ---------------- PREFERENCES UPDATE ---------------- */
      if (
        translationLanguage &&
        translationLanguage !== userDetails.translationLanguage
      ) {
        await conversationModel.updateMany(
          { userId: userDetails._id },
          { $unset: { translatedContent: "" } }
        );
      }

      updatePayload.translationLanguage = translationLanguage;
      updatePayload.languageLevel = languageLevel;
      updatePayload.learningStyle = learningStyle;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userDetails._id,
      updatePayload,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    /* ---------------- TOKEN + COOKIE ---------------- */
    const userToken = createToken(updatedUser.toObject());
    setAuthCookie(res, userToken);

    /* ---------------- REDIS CACHE ---------------- */
    await client.set(userDetails?._id, JSON.stringify(updatePayload), {
      EX: 86400,
    });

    return res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.PROFILE_UPDATE,
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
