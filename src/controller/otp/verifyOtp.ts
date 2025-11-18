import bcrypt from "bcrypt";
import { Request, Response } from "express";
import client from "../../redis/redisClient";
import { userModel } from "../../model/userModel";
import { ERROR_MESSAGES } from "../../constants/messages";
import { createToken } from "../../token/jwtToken";
import setAuthCookie from "../../lib/storeCookie";

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Retrieve the stored OTP from Redis
    const storedOtp = await client.get("lingoOtp");
    if (storedOtp !== otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid; proceed with password reset logic here
    // (e.g., update the user's password in the database)

    const user = await userModel.findOne({
      email: { $regex: email, $options: "i" },
    });

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // Check if user exists and update password
    if (user) {
      // Update user's password
      user.password = hashPassword;
      user.loginWith = "PASSWORD";
      await user.save();

      // Generate JWT token for authenticated user
      const userToken = createToken(user.toObject());

      // Set authentication cookie in response
      setAuthCookie(res, userToken);

      // Optionally, delete the OTP from Redis after successful verification
      await client.del("lingoOtp");

      res.status(200).json({
        status: true,
        message: "OTP verified successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Failed to verify OTP",
    });
  }
};

export default verifyOtp;
