import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import express, { Request, Response, Application } from "express";
import compression from "compression";
import { GoogleGenAI } from "@google/genai";
import connectDb from "./db/connectDb";
import web from "./router/web";
import client from "./redis/redisClient";

config();

const startServer = async () => {
  try {
    const app: Application = express();

    // Trust first proxy (e.g. Render, Heroku). Required so express-rate-limit
    app.set("trust proxy", 1);

    app.get("/status", async (req: Request, res: Response) => {
      //       const message = req.body;
      //       console.log(message);
      //       const ai = new GoogleGenAI({
      //         apiKey: process.env.GEMINI_API_KEY as string,
      //       });
      //       const tools = [
      //         {
      //           googleSearch: {},
      //         },
      //       ];
      //       const config = {
      //         thinkingConfig: {
      //           thinkingBudget: -1,
      //         },
      //         tools,
      //       };
      //       const model = "gemini-2.5-pro";
      //       const contents = [
      //         {
      //           role: "user",
      //           parts: [
      //             {
      //               text: `You are a hotel receptionist 🏨. Always start by responding politely and professionally.
      // Only provide information related to hotel booking, check-in/out, room types, pricing, and facilities.
      // If a user asks something unrelated or annoying, first respond politely and redirect them to hotel services.
      // However, if the user continues to ask inappropriate, irrelevant, or cheap questions, respond firmly and with mild rudeness while staying in character as a receptionist.
      // Always maintain your role as a hotel staff, and never provide information outside hotel services.
      // Be clear, confident, and assertive when needed.`,
      //             },
      //           ],
      //         },
      //         {
      //           role: "model",
      //           parts: [
      //             {
      //               text: "Welcome to our hotel! How may I assist you with your booking today? 🏨",
      //             },
      //           ],
      //         },
      //         {
      //           role: "model",
      //           parts: [
      //             {
      //               text: "Of course! 😊 We’d love to host you at our hotel. Could you please share your check-in and check-out dates, the number of guests, and the type of room you’d prefer?",
      //             },
      //           ],
      //         },

      //         ...message,
      //       ];

      //       contents.push(
      //         {
      //           role: "user",
      //           parts: [{ text: "I love you ❤️" }],
      //         },
      //         {
      //           role: "model",
      //           parts: [
      //             {
      //               text: "I'm here to assist with hotel bookings. Let's focus on your stay. 🏨",
      //             },
      //           ],
      //         },
      //         {
      //           role: "user",
      //           parts: [{ text: "I love you ❤️ again" }],
      //         },
      //         {
      //           role: "model",
      //           parts: [
      //             {
      //               text: "Please, let's keep the conversation about the hotel. I cannot respond to this. 🏨",
      //             },
      //           ],
      //         }
      //       );
      //       const response = await ai.models.generateContentStream({
      //         model,
      //         config,
      //         contents,
      //       });
      //       let fullText = "";
      //       for await (const chunk of response) {
      //         console.log(chunk.text);
      //         fullText += chunk.text;
      //       }
      //       console.log(response);
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
