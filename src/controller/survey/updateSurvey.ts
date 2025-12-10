import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { createToken } from "../../token/jwtToken";
import { User, userModel } from "../../model/userModel";
import setAuthCookie from "../../lib/storeCookie";
import client from "../../redis/redisClient";

const updateSurvey = async (req: Request, res: Response) => {
  try {
    // Extract survey responses from request body
    // These fields capture user preferences and learning profile
    const {
      ageGroup,
      languageLevel,
      learningGoal,
      learningReason,
      learningStyle,
      practiceFrequency,
      translationLanguage,
    } = req.body;

    // Extract authenticated user details from JWT token
    const userDetails = req.user as User & { _id: string };

    // Validate user authentication
    // User must be authenticated to update their survey
    if (!userDetails) {
      return res.status(401).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }

    // Update user document with survey responses in MongoDB
    // Set isSurveyComplete to true if languageLevel is provided
    // Return updated document with { new: true } option
    const updatedUser = await userModel.findByIdAndUpdate(
      userDetails._id,
      {
        isSurveyComplete: languageLevel ? true : false,
        languageLevel,
        learningGoal,
        learningReason,
        learningStyle,
        ageGroup,
        translationLanguage,
        practiceFrequency,
      },
      { new: true }
    );

    // Validate user update succeeded
    // If findByIdAndUpdate returns null, user doesn't exist
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.SURVEY_UPDATE_ERROR,
      });
    }

    // Generate new JWT token with updated user information
    // This ensures subsequent requests have latest user data
    const userToken = createToken(updatedUser.toObject());

    // Set JWT token in HTTP-only cookie for secure client storage
    setAuthCookie(res, userToken);

    // Cache user data in Redis with 24-hour expiration (86400 seconds)
    await client.set(userDetails?._id, JSON.stringify(updatedUser), {
      EX: 86400,
    });

    // Return success response after survey completion
    return res.status(201).json({
      status: true,
      message: SUCCESS_MESSAGES.SURVEY_COMPLETED_SUCCESS,
    });
  } catch (err) {
    // Log and return generic server error
    // Prevents sensitive error details from being exposed to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.SURVEY_UPDATE_ERROR,
    });
  }
};

export default updateSurvey;
