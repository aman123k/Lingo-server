import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { createToken, verifyToken } from "../../token/jwtToken";
import { User, userModel } from "../../model/userModel";
import setAuthCookie from "../../lib/storeCookie";

const updateSurvey = async (req: Request, res: Response) => {
  try {
    // Extract survey data from request body (for new users or survey completion)
    const {
      ageGroup,
      languageLevel,
      learningGoal,
      learningReason,
      learningStyle,
      practiceFrequency,
      translationLanguage,
    } = req.body;

    const userDetails = req.user as User & { _id: string };

    // Check if token verification failed or returned null
    if (!userDetails) {
      return res.status(401).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_TOKEN,
      });
    }
    // User exists but hasn't completed survey - update with survey data
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

    // Handle case where user update fails
    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.SURVEY_UPDATE_ERROR,
      });
    }

    // Generate JWT token for updated user
    const userToken = createToken(updatedUser.toObject());
    setAuthCookie(res, userToken);

    return res.status(201).json({
      status: true,
      message: SUCCESS_MESSAGES.SURVEY_COMPLETED_SUCCESS,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.SURVEY_UPDATE_ERROR,
    });
  }
};

export default updateSurvey;
