import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages";
import { User, userModel } from "../../model/userModel";
import { contactModel } from "../../model/contactModel";
import { supportEmail } from "../../lib/templates/supportTemplate";
import { Resend } from "resend";

const contact = async (req: Request, res: Response) => {
  try {
    // Extract authenticated user details from request
    const userDetails = req.user as User & { _id: string };

    // Extract subTitle and problem from request body
    const { subDescription, subTitle } = req.body;

    // Validate required fields
    if (!subTitle || !subDescription) {
      return res.status(400).json({
        status: false,
        message: ERROR_MESSAGES.CONTACT_REQUEST_MISSING_FIELDS,
      });
    }

    // Get user email from database to ensure it's current
    const user = await userModel.findOne({ email: userDetails.email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Create new contact request in database
    const contactRequest = new contactModel({
      userEmail: user.email,
      subject: subTitle.trim(),
      problem: subDescription.trim(),
      status: "pending",
    });

    // Save the contact request
    await contactRequest.save();

    // Send email notification to support team
    const resend = new Resend(process.env.RESEND_API_KEY as string);

    // // Send the email to support team (you may want to use a different email for support)
    const { data, error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL as string,
      to: user.email,
      subject: `New Support Request: ${subTitle}`,
      html: supportEmail(user, subTitle.trim(), subDescription.trim()),
    });
    // Handle any errors during email sending
    if (error) {
      return res.status(500).json({
        status: false,
        message: ERROR_MESSAGES.FAIL_TO_SEND_OTP,
      });
    }

    // Return success response
    res.status(200).json({
      status: true,
      message: SUCCESS_MESSAGES.CONTACT_REQUEST_SUCCESS,
    });
  } catch (err) {
    // Log error details for debugging
    console.log(ERROR_MESSAGES.CONTACT_REQUEST_ERROR, err);

    // Return generic server error response
    res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.CONTACT_REQUEST_ERROR,
    });
  }
};

export default contact;
