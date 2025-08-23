import Jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const TOKEN_KEY = process.env.TOKEN_KEY as string;

const createToken = (user: object) => {
  const token = Jwt.sign(user, TOKEN_KEY);
  return token;
};

const verifyToken = (token: string) => {
  try {
    if (!token) return null;
    const userInfo = Jwt.verify(token, TOKEN_KEY);
    return userInfo;
  } catch {
    return null;
  }
};

export { createToken, verifyToken };
