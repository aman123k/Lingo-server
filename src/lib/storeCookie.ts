import { Response } from "express";

/**
 * Sets authentication cookie with JWT token
 * Configures secure cookie settings for production use
 */
const setAuthCookie = (res: Response, token: string) => {
  res.cookie("EnglishBuddyToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
    sameSite: "none",
  });
};

export default setAuthCookie;
