import { Request, Response } from "express";
import { User, userModel } from "../../model/userModel";
import { ERROR_MESSAGES } from "../../constants/messages";
import { createToken } from "../../token/jwtToken";
import setAuthCookie from "../../lib/storeCookie";
import client from "../../redis/redisClient";

const subscribeUser = async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    const userDetails = req.user as User & { _id: string };

    if (!plan || !["gold", "platinum", "free"].includes(plan)) {
      return res.status(400).json({
        status: false,
        message: "Invalid or missing subscription plan",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userDetails._id,
      { subscriptionPlan: plan },
      { new: true }
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
    // Remove key from Redis cache to force getUserInfo to retrieve the updated doc
    await client.del(userDetails._id);

    return res.status(200).json({
      status: true,
      message: "Subscription updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log("Error updating subscription:", err);
    return res.status(500).json({
      status: false,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default subscribeUser;
