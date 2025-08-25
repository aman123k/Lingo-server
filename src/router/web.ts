import express, { Router } from "express";
import googleAuth from "../auth/googleAuth";
import getUserInfo from "../controller/user/getUser";
import updateSurvey from "../controller/survey/updateSurvey";
import registerUser from "../controller/user/registerUser";
import loginUser from "../controller/user/loginUser";

const router: Router = express.Router();

// POST REQUEST
router.post("/api/googleAuth", googleAuth);
router.post("/api/survey", updateSurvey);
router.post("/api/register", registerUser);
router.post("/api/login", loginUser);

// GET REQUEST
router.get("/api/userInformation", getUserInfo);

export default router;
