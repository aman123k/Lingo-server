import rateLimit from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants/messages";

// Rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: ERROR_MESSAGES.AUTH_REQUEST_ERROR },
});

// Rate limiter for OTP requests
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 3, // Max requests per hour
  message: { status: false, message: ERROR_MESSAGES.OTP_REQUEST_ERROR },
  statusCode: 429,
});
// Rate limiter for OTP requests
export const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 20, // Max requests per hour
  message: {
    status: false,
    message:
      "We’ve exceeded today’s quota; try again later or upgrade for higher limits.",
  },
  statusCode: 429,
});
