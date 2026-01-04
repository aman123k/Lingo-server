import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import express, { Request, Response, Application } from "express";
import compression from "compression";
import connectDb from "./db/connectDb";
import web from "./router/web";
import client from "./redis/redisClient";
config();

const startServer = async () => {
  try {
    const app: Application = express();

    // Trust first proxy (e.g. Render, Heroku). Required so express-rate-limit
    app.set("trust proxy", 1);

    app.get("/status", (req: Request, res: Response) => {
      res.json({ status: "ok" });
    });
    // Middleware setup
    app.use(cookieParser());
    app.use(compression());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "5mb" }));
    // Enable CORS with credentials
    app.use(
      cors({
        credentials: true,
        origin: process.env.REQUEST_URL as string,
      })
    );

    // Connect to MongoDB
    await connectDb(process.env.DATABASE_URL as string);
    app.use("/", web);
    // Connect to Redis
    await client.connect();

    // Start the server
    const port: number = parseInt(process.env.PORT || "4000", 10);

    const server = app.listen(port, () => {
      console.log(`server is running on  http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
    console.log("Error while server is getting started");
  }
};
startServer();
