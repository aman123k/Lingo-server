import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { userModel } from "../../model/userModel";
import client from "../../redis/redisClient";
import nodemailer from "nodemailer";
import { otpEmail } from "./otpTemplate";

const sentOtp = async (req: Request, res: Response) => {
  try {
    // Extract email from request body
    const email = req.body.email as string;
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
    // Store OTP in Redis with 5-minute expiration
    await client.set("lingoOtp", otp.toString(), { EX: 300 });

    const mailOPtions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your OTP for Password Reset",
      html: otpEmail(user, otp),
    };

    // Configure nodemailer transport using Brevo SMTP
    const transportResponse = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.SMTP_KEY,
      },
    });

    // Send the email with OTP
    await transportResponse.sendMail(mailOPtions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    // Return success response
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.OTP_SENT_TO_MAIL,
    });
  } catch (err) {
    // Log error details for debugging
    console.log(ERROR_MESSAGES.FAIL_TO_SEND_OTP, err);
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.FAIL_TO_SEND_OTP,
    });
  }
};
export default sentOtp;
