import express, { Router } from "express";
import googleAuth from "../auth/googleAuth";

const router: Router = express.Router();

// POST REQUEST
router.post("/api/googleAuth", googleAuth);

// GET REQUEST
// router.get()
export default router;
