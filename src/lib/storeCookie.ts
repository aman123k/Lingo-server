import { Response } from "express";

/**
 * Sets authentication cookie with JWT token
 */
const setAuthCookie = (res: Response, token: string) => {
  res.cookie("Lingo", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sameSite: "none",
  });
};

export default setAuthCookie;
