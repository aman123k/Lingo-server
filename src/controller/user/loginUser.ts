import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User, userModel } from "../../model/userModel";
import { createToken } from "../../token/jwtToken";
import setAuthCookie from "../../lib/storeCookie";

const loginUser = async (req: Request, res: Response) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;
    console.log(email, password);
    // Find user in database with case-insensitive email matching
    const user = await userModel.findOne({
      email: { $regex: email, $options: "i" },
    });

    // Check if user exists in database
    if (!user) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Verify user registered with password (not social login)
    if (user.loginWith !== "PASSWORD") {
      return res.status(400).json({
        status: false,
        message: `${ERROR_MESSAGES.USER_EXISTS} ${user.loginWith}`,
      });
    }

    // Compare provided password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // Check if password matches
    if (!isPasswordMatch) {
      return res.status(500).json({
        status: false,
        message: ERROR_MESSAGES.INVALID_PASSWORD,
      });
    }

    // Generate JWT token for authenticated user
    const userToken = createToken(user.toObject());

    // Set authentication cookie in response
    setAuthCookie(res, userToken);

    // Return success response
    res.status(201).json({
      status: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      route: "/",
    });
  } catch (err) {
    // Log error for debugging
    console.log(ERROR_MESSAGES.USER_LOGIN_ERROR, err);

    // Return generic server error to client
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.USER_LOGIN_ERROR,
    });
  }
};

export default loginUser;
