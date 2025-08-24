import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { userModel } from "../model/userModel";
import { GoogleUser } from "../interface/interface";
import { createToken } from "../token/jwtToken";
import setAuthCookie from "../lib/storeCookie";

/**
 * Google OAuth authentication handler
 * Handles user registration and login via Google OAuth
 * Supports both new user registration and existing user login
 */
const googleAuth = async (req: Request, res: Response) => {
  try {
    // Extract Google access token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

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

    // Fetch user information from Google OAuth API
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const json = (await response.json()) as GoogleUser;

    // Check if user already exists in our database
    const user = await userModel.findOne({ email: json?.email });

    // Handle existing user scenarios
    if (user) {
      // Check if user registered with a different method (email/password)
      if (user?.loginWith !== "GOOGLE") {
        return res.status(400).json({
          status: false,
          message: `${ERROR_MESSAGES.USER_EXISTS} ${user.loginWith}`,
        });
      }

      // If user has completed survey, proceed with login
      if (user.isSurveyComplete) {
        // Generate JWT token for existing user
        const userToken = createToken(user.toObject());
        setAuthCookie(res, userToken);

        return res.status(201).json({
          status: true,
          message: SUCCESS_MESSAGES.GOOGLE_LOGIN_SUCCESS,
          route: "/",
        });
      }

      // User exists but hasn't completed survey - update with survey data
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
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
          message: ERROR_MESSAGES.USER_UNKNOWN_ERROR,
        });
      }

      // Generate JWT token for updated user
      const userToken = createToken(updatedUser.toObject());
      setAuthCookie(res, userToken);
      const route = updatedUser.isSurveyComplete ? "/" : "/survey";
      return res.status(201).json({
        status: true,
        message: SUCCESS_MESSAGES.GOOGLE_LOGIN_SUCCESS,
        route,
      });
    }

    // Create new user document with Google data and survey information
    const newUserDoc = new userModel({
      name: json?.name,
      email: json?.email,
      loginWith: "GOOGLE",
      isSurveyComplete: languageLevel ? true : false, // Mark complete if survey data provided
      languageLevel,
      learningGoal,
      learningReason,
      learningStyle,
      ageGroup,
      translationLanguage,
      practiceFrequency,
    });

    // Save new user to database
    const registerUser = await newUserDoc.save();

    // Generate JWT token for new user
    const userToken = createToken(registerUser.toObject());
    setAuthCookie(res, userToken);

    // Determine redirect route based on whether user has language level set
    const route = registerUser.isSurveyComplete ? "/" : "/survey";

    // Return success response with appropriate route
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      route,
    });
  } catch (err) {
    // Log error for debugging purposes
    console.log(ERROR_MESSAGES.GOOGLE_AUTH_SERVER_ERROR, err);

    // Return generic server error to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.GOOGLE_AUTH_SERVER_ERROR,
    });
  }
};

export default googleAuth;
