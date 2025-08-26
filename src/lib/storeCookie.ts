import { Response } from "express";

/**
 * Sets authentication cookie with JWT token
 * Configures secure cookie settings for production use
 */
const setAuthCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("EnglishBuddyToken", token, {
    httpOnly: true,
    secure: isProd,
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sameSite: isProd ? "none" : "lax",
  });
};

export default setAuthCookie;
