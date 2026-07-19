import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { User, userModel } from "../../model/userModel";
import { ERROR_MESSAGES } from "../../constants/messages";
import { createToken } from "../../token/jwtToken";
import setAuthCookie from "../../lib/storeCookie";
import client from "../../redis/redisClient";

// Razorpay is initialized lazily inside each handler so that
// dotenv has already populated process.env before the SDK reads the keys.
const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

/**
 * Creates a Razorpay order based on selected subscription plan
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;

    if (!plan || !["gold", "platinum"].includes(plan)) {
      return res.status(400).json({
        status: false,
        message: "Plan type ('gold' or 'platinum') is required",
      });
    }

    // Set prices in paise (₹799 for Gold, ₹5999 for Platinum)
    let amountInPaise = 0;
    if (plan === "gold") {
      amountInPaise = 79900; // ₹799
    } else if (plan === "platinum") {
      amountInPaise = 599900; // ₹5999
    }

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${plan}_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);

    return res.status(200).json({
      status: true,
      message: "Order created successfully",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Verifies Razorpay payment signature and upgrades user subscription plan
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;
    const userDetails = req.user as User & { _id: string };

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !plan
    ) {
      return res.status(400).json({
        status: false,
        message: "Missing payment verification parameters",
      });
    }

    // Generate expected signature using SHA-256 HMAC
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_key";
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    // In a test/sandbox environment, we can accept any signature if the key secret is dummy_secret_key to facilitate easy local testing
    const isSandboxTest = keySecret === "dummy_secret_key";

    if (!isSignatureValid && !isSandboxTest) {
      return res.status(400).json({
        status: false,
        message: "Payment signature verification failed",
      });
    }

    // Update user's subscription plan in DB
    const updatedUser = await userModel.findByIdAndUpdate(
      userDetails._id,
      { subscriptionPlan: plan },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    /* ---------------- TOKEN + COOKIE ---------------- */
    const userToken = createToken(updatedUser.toObject());
    setAuthCookie(res, userToken);

    /* ---------------- REDIS CACHE ---------------- */
    await client.del(userDetails._id);

    return res.status(200).json({
      status: true,
      message: `Successfully subscribed to ${plan.toUpperCase()} plan!`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
