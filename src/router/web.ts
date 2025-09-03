import express, { Router } from "express";
import googleAuth from "../auth/googleAuth";
import getUserInfo from "../controller/user/getUser";
import updateSurvey from "../controller/survey/updateSurvey";
import registerUser from "../controller/user/registerUser";
import loginUser from "../controller/user/loginUser";
import { authLimiter } from "../middleware/rateLimiter";
import GitHubAuth from "../auth/githubAuth";
import verifyTokenMiddleware from "../middleware/verifyToken";

const router: Router = express.Router();

// POST REQUEST
router.post("/api/googleAuth", googleAuth);
router.post("/api/githubAuth", GitHubAuth);
router.post("/api/survey", verifyTokenMiddleware, updateSurvey);
router.post("/api/register", authLimiter, registerUser);
router.post("/api/login", authLimiter, loginUser);

// GET REQUEST
router.get("/api/userInformation", verifyTokenMiddleware, getUserInfo);

export default router;
