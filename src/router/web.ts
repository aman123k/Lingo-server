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
import translateLanguage from "../controller/translate/translateLanguage";
import logoutUser from "../controller/user/logoutUser";
import deleteUser from "../controller/user/deleteUser";
import updateUser from "../controller/user/updateUser";
import allCharacters from "../controller/characters/allCharacters";
import characterService from "../controller/characters/characterService";
import allDebates from "../controller/debates/allDebates";
import allRoleplays from "../controller/roleplays/allRoleplays";
import allTravels from "../controller/travels/allTravels";
import debateService from "../controller/debates/debatesService";
import roleplayService from "../controller/roleplays/roleplaysService";
import travelsService from "../controller/travels/travelsService";
import getFeedback from "../controller/feedback/getFeedback";
import contact from "../controller/support/contact";
import getProgress from "../controller/progress/getProgress";
import clearChat from "../controller/chats/clearChat";
import getChatSessions from "../controller/chats/getChatSessions";
import learningModeService from "../controller/chats/learningModeService";

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
router.post(
  "/api/translate",
  verifyTokenMiddleware,
  chatLimiter,
  translateLanguage
);
router.post("/api/logoutUser", verifyTokenMiddleware, logoutUser);
router.post("/api/updateUserInfo", verifyTokenMiddleware, updateUser);
// Character, Debate, Roleplay Services with Rate Limiting
router.post(
  "/api/characterService",
  verifyTokenMiddleware,
  chatLimiter,
  characterService
);
router.post(
  "/api/debateService",
  verifyTokenMiddleware,
  chatLimiter,
  debateService
);
router.post(
  "/api/roleplayService",
  verifyTokenMiddleware,
  chatLimiter,
  roleplayService
);
router.post(
  "/api/travelsService",
  verifyTokenMiddleware,
  chatLimiter,
  travelsService
);
router.post(
  "/api/learningModeService",
  verifyTokenMiddleware,
  chatLimiter,
  learningModeService
);

router.post(
  "/api/get-feedback",
  verifyTokenMiddleware,
  chatLimiter,
  getFeedback
);

router.post("/api/addSupport", verifyTokenMiddleware, contact);

// GET REQUEST
router.get("/api/userInformation", verifyTokenMiddleware, getUserInfo);
router.get("/api/chatHistory", verifyTokenMiddleware, chatHistory);
router.get("/api/allCharacter", verifyTokenMiddleware, allCharacters);
router.get("/api/allDebates", verifyTokenMiddleware, allDebates);
router.get("/api/allRoleplays", verifyTokenMiddleware, allRoleplays);
router.get("/api/allTravels", verifyTokenMiddleware, allTravels);
router.get("/api/userProgress", verifyTokenMiddleware, getProgress);
router.get("/api/chatSessions", verifyTokenMiddleware, getChatSessions);

// DELETE REQUEST
router.delete("/api/deleteUser", verifyTokenMiddleware, deleteUser);
router.delete("/api/clearChat", verifyTokenMiddleware, clearChat);

export default router;
