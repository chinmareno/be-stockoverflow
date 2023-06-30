import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routers/index.js";
import { Server } from "http";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
config();

const app: Application = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT: number = Number(process.env.PORT) || 2000;

app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/cek", (req: Request, res: Response): void => {
  res.send("iyaa awokoawk");
});

app.use("/", router);

const server: Server = app.listen(PORT, () => {
  console.log(`Server is berlari on port ${PORT}`);
});
