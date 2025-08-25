import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User, userModel } from "../../model/userModel";

const registerUser = async (req: Request, res: Response) => {
  try {
    // Extract survey and user data from request body
    const {
      name,
      email,
      password,
      ageGroup,
      languageLevel,
      learningGoal,
      learningReason,
      learningStyle,
      practiceFrequency,
      translationLanguage,
    } = req.body;

    // Find user in database with case-insensitive email matching
    const user = (await userModel.findOne({
      email: { $regex: email, $options: "i" },
    })) as User;

    // Check if user registered with a different method (google/github)
    if (user && user.loginWith !== "PASSWORD") {
      return res.status(400).json({
        status: false,
        message: `${ERROR_MESSAGES.USER_EXISTS} ${user.loginWith}`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user document with Google data and survey information
    const newUserDoc = new userModel({
      name: name,
      email: email,
      password: hashPassword,
      loginWith: "PASSWORD",
      isSurveyComplete: true,
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

    // Return success response with appropriate route
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      route: "/",
    });
  } catch (err) {
    console.log(ERROR_MESSAGES.USER_CREATION_ERROR, err);

    // Return generic server error to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.USER_CREATION_ERROR,
    });
  }
};

export default registerUser;
