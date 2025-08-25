import rateLimit from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants/messages";

// Rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: ERROR_MESSAGES.AUTH_REQUEST_ERROR,
});
