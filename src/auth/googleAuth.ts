import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/messages";
import { userModel } from "../model/userModel";
import { GoogleUser } from "../interface/interface";
import { createToken } from "../token/jwtToken";
const googleAuth = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const {
      ageGroup,
      languageLevel,
      learningGoal,
      learningReason,
      learningStyle,
      practiceFrequency,
      translationLanguage,
    } = req.body;

    // Fetch Google user info
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );

    // Tell TypeScript the type of the JSON response
    const json = (await response.json()) as GoogleUser;
    const user = await userModel.findOne({ email: json?.email });

    // Existing user
    if (user) {
      if (user?.loginWith !== "GOOGLE") {
        return res.status(400).json({
          status: false,
          message: `${ERROR_MESSAGES.USER_EXISTS} ${user.loginWith}`,
        });
      }
      // Login existing Google user
      const userToken = createToken(user.toObject());
      res.cookie("EnglishBuddyToken", userToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
      });

      const route = user.languageLevel ? "/" : "/survey";

      return res.status(201).json({
        status: true,
        message: user.languageLevel
          ? SUCCESS_MESSAGES.GOOGLE_LOGIN_SUCCESS
          : SUCCESS_MESSAGES.REGISTER_SUCCESS,
        route,
      });
    }
    const newUserDoc = new userModel({
      name: json?.name,
      email: json?.email,
      loginWith: "GOOGLE",
      isSurveyComplete: languageLevel ? true : false,
      languageLevel,
      learningGoal,
      learningReason,
      learningStyle,
      ageGroup,
      translationLanguage,
      practiceFrequency,
    });

    const registerUser = await newUserDoc.save();
    const userToken = createToken(registerUser.toObject());

    res.cookie("EnglishBuddyToken", userToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sameSite: "none",
    });
    const route = registerUser.languageLevel ? "/" : "/survey";
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      route,
    });
  } catch (err) {
    console.log(ERROR_MESSAGES.GOOGLE_AUTH_SERVER_ERROR, err);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.GOOGLE_AUTH_SERVER_ERROR,
    });
  }
};

export default googleAuth;
