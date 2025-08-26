import { config } from "dotenv";
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { createToken } from "../token/jwtToken";
import setAuthCookie from "../lib/storeCookie";
import { userModel } from "../model/userModel";
config();

type GitHubToken = {
  access_token?: string;
  token_type?: string;
  scope?: string;
};

type GitHubUserResponse = {
  name: string;
  email: string;
};

const GitHubAuth = async (req: Request, res: Response) => {
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

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_KEY,
          code: token,
        }),
      }
    );
    const data = (await response.json()) as GitHubToken;
    const githubAccessToken = data?.access_token;

    const userDetails = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${githubAccessToken}`,
      },
    });
    const json = (await userDetails.json()) as GitHubUserResponse;

    // Find user in database with case-insensitive email matching
    const user = await userModel.findOne({
      email: { $regex: `${json?.email}`, $options: "i" },
    });

    // Handle existing user scenarios
    if (user) {
      // Check if user registered with a different method (email/password)
      if (user?.loginWith !== "GITHUB") {
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
          message: SUCCESS_MESSAGES.GITHUB_LOGIN_SUCCESS,
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
        message: SUCCESS_MESSAGES.GITHUB_LOGIN_SUCCESS,
        route,
      });
    }

    // Create new user document with Google data and survey information
    const newUserDoc = new userModel({
      name: json?.name,
      email: json?.email,
      loginWith: "GITHUB",
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
    console.log(ERROR_MESSAGES.GITHUB_AUTH_SERVER_ERROR, err);

    // Return generic server error to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.GITHUB_AUTH_SERVER_ERROR,
    });
  }
};
export default GitHubAuth;
