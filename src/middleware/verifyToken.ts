import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../token/jwtToken";
import { ERROR_MESSAGES } from "../constants/messages";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract JWT token from HTTP-only cookie
  const token: string = req.cookies?.Lingo;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
    });
  }

  const userInfo = verifyToken(token);

  if (!userInfo) {
    return res.status(401).json({
      status: false,
      message: ERROR_MESSAGES.INVALID_TOKEN,
    });
  }

  req.user = userInfo;
  next();
};

export default verifyTokenMiddleware;
