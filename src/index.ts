import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import express, { Request, Response, Application } from "express";

config();

const startServer = () => {
  try {
    const app: Application = express();
    app.get("/status", (req: Request, res: Response) => {
      res.json({ status: "ok" });
    });

    app.use(cookieParser());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(cors());

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
