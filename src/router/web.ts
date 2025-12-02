import express, { Router } from "express";
import googleAuth from "../auth/googleAuth";
import getUserInfo from "../controller/user/getUser";
import updateSurvey from "../controller/survey/updateSurvey";
import registerUser from "../controller/user/registerUser";
import loginUser from "../controller/user/loginUser";
import {
  authLimiter,
  chatLimiter,
  otpLimiter,
} from "../middleware/rateLimiter";
import GitHubAuth from "../auth/githubAuth";
import verifyTokenMiddleware from "../middleware/verifyToken";
import sentOtp from "../controller/otp/sentOtp";
import verifyOtp from "../controller/otp/verifyOtp";
import chatHistory from "../controller/chats/chatHistory";
import chatService from "../controller/chats/chatService";

const router: Router = express.Router();

// POST REQUEST
router.post("/api/googleAuth", googleAuth);
router.post("/api/githubAuth", GitHubAuth);
router.post("/api/survey", verifyTokenMiddleware, updateSurvey);
router.post("/api/register", authLimiter, registerUser);
router.post("/api/login", authLimiter, loginUser);
router.post("/api/forgot-password", otpLimiter, sentOtp);
router.post("/api/verify-otp", verifyOtp);
router.post(
  "/api/chatService",
  verifyTokenMiddleware,
  chatLimiter,
  chatService
);

// GET REQUEST
router.get("/api/userInformation", verifyTokenMiddleware, getUserInfo);
router.get("/api/chatHistory", verifyTokenMiddleware, chatHistory);

export default router;
